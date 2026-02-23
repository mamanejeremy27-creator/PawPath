import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DogsService } from './dogs.service';
import { Dog } from '../../entities/dog.entity';
import { EarnedBadge } from '../../entities/earned-badge.entity';

describe('DogsService', () => {
  let service: DogsService;
  let dogRepo: jest.Mocked<Partial<Repository<Dog>>>;
  let badgeRepo: jest.Mocked<Partial<Repository<EarnedBadge>>>;

  const userId = 'user-1';
  const dogId = 'dog-1';

  const mockDog: Dog = {
    id: dogId,
    name: 'Rex',
    breed: 'German Shepherd',
    birthday: new Date('2020-01-01'),
    weight: 30,
    avatar: null,
    photo: null,
    userId,
    user: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    dogRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
      count: jest.fn(),
    };
    badgeRepo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DogsService,
        { provide: getRepositoryToken(Dog), useValue: dogRepo },
        { provide: getRepositoryToken(EarnedBadge), useValue: badgeRepo },
      ],
    }).compile();

    service = module.get<DogsService>(DogsService);
  });

  describe('findAll', () => {
    it('should return all dogs for a user', async () => {
      const dogs = [mockDog];
      dogRepo.find.mockResolvedValue(dogs);

      const result = await service.findAll(userId);

      expect(result).toEqual(dogs);
      expect(dogRepo.find).toHaveBeenCalledWith({
        where: { userId },
        order: { createdAt: 'ASC' },
      });
    });

    it('should return empty array when user has no dogs', async () => {
      dogRepo.find.mockResolvedValue([]);

      const result = await service.findAll(userId);

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a dog when found', async () => {
      dogRepo.findOne.mockResolvedValue(mockDog);

      const result = await service.findOne(dogId, userId);

      expect(result).toEqual(mockDog);
      expect(dogRepo.findOne).toHaveBeenCalledWith({
        where: { id: dogId, userId },
      });
    });

    it('should throw NotFoundException when dog not found', async () => {
      dogRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne(dogId, userId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when dog belongs to different user', async () => {
      dogRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne(dogId, 'other-user')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create and return a dog', async () => {
      const dto = { name: 'Rex', breed: 'German Shepherd' };
      dogRepo.count.mockResolvedValue(0);  // first dog, no limit hit; no badge threshold
      dogRepo.create.mockReturnValue(mockDog);
      dogRepo.save.mockResolvedValue(mockDog);

      const result = await service.create(userId, dto);

      expect(result).toEqual({ ...mockDog, newBadges: [] });
      expect(dogRepo.create).toHaveBeenCalledWith({ ...dto, userId });
      expect(dogRepo.save).toHaveBeenCalledWith(mockDog);
    });
  });

  describe('update', () => {
    it('should update and return the dog', async () => {
      const dto = { name: 'Updated Rex' };
      const updatedDog = { ...mockDog, name: 'Updated Rex' };
      dogRepo.findOne.mockResolvedValue({ ...mockDog });
      dogRepo.save.mockResolvedValue(updatedDog);

      const result = await service.update(dogId, userId, dto);

      expect(result).toEqual(updatedDog);
      expect(dogRepo.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when dog not found', async () => {
      dogRepo.findOne.mockResolvedValue(null);

      await expect(
        service.update(dogId, userId, { name: 'Updated' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updatePhoto', () => {
    it('should update and return the dog with new photo', async () => {
      const photoPath = '/uploads/dogs/photo.jpg';
      const updatedDog = { ...mockDog, photo: photoPath };
      dogRepo.findOne.mockResolvedValue({ ...mockDog });
      dogRepo.save.mockResolvedValue(updatedDog);

      const result = await service.updatePhoto(dogId, userId, photoPath);

      expect(result).toEqual(updatedDog);
      expect(dogRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ photo: photoPath }),
      );
    });

    it('should throw NotFoundException when dog not found', async () => {
      dogRepo.findOne.mockResolvedValue(null);

      await expect(
        service.updatePhoto(dogId, userId, '/uploads/photo.jpg'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove the dog', async () => {
      dogRepo.findOne.mockResolvedValue(mockDog);
      dogRepo.remove.mockResolvedValue(mockDog);

      await service.remove(dogId, userId);

      expect(dogRepo.remove).toHaveBeenCalledWith(mockDog);
    });

    it('should throw NotFoundException when dog not found', async () => {
      dogRepo.findOne.mockResolvedValue(null);

      await expect(service.remove(dogId, userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
