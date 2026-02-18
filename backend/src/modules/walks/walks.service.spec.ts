import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { WalksService } from './walks.service';
import { Walk } from '../../entities/walk.entity';
import { Dog } from '../../entities/dog.entity';

describe('WalksService', () => {
  let service: WalksService;
  let walkRepo: jest.Mocked<Partial<Repository<Walk>>>;
  let dogRepo: jest.Mocked<Partial<Repository<Dog>>>;

  const userId = 'user-1';
  const dogId = 'dog-1';
  const mockDog = { id: dogId, userId, name: 'Rex' } as Dog;

  const mockWalk: Walk = {
    id: 'walk-1',
    dogId,
    dog: mockDog,
    startTime: new Date('2024-01-15T10:00:00Z'),
    endTime: new Date('2024-01-15T10:30:00Z'),
    distance: 2.5,
    duration: 1800,
    route: [{ lat: 32.0, lng: 34.0 }],
    notes: 'Nice walk',
    createdAt: new Date(),
  };

  beforeEach(async () => {
    walkRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };
    dogRepo = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalksService,
        { provide: getRepositoryToken(Walk), useValue: walkRepo },
        { provide: getRepositoryToken(Dog), useValue: dogRepo },
      ],
    }).compile();

    service = module.get<WalksService>(WalksService);
  });

  describe('findByDog', () => {
    it('should return walks for an owned dog', async () => {
      const walks = [mockWalk];
      dogRepo.findOne.mockResolvedValue(mockDog);
      walkRepo.find.mockResolvedValue(walks);

      const result = await service.findByDog(dogId, userId);

      expect(result).toEqual(walks);
      expect(dogRepo.findOne).toHaveBeenCalledWith({
        where: { id: dogId, userId },
      });
      expect(walkRepo.find).toHaveBeenCalledWith({
        where: { dogId },
        order: { startTime: 'DESC' },
      });
    });

    it('should throw ForbiddenException if dog not owned', async () => {
      dogRepo.findOne.mockResolvedValue(null);

      await expect(service.findByDog(dogId, 'other-user')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('create', () => {
    it('should create and return a walk', async () => {
      const dto = {
        dogId,
        startTime: new Date('2024-01-15T10:00:00Z'),
        endTime: new Date('2024-01-15T10:30:00Z'),
        distance: 2.5,
        duration: 1800,
      };
      dogRepo.findOne.mockResolvedValue(mockDog);
      walkRepo.create.mockReturnValue(mockWalk);
      walkRepo.save.mockResolvedValue(mockWalk);

      const result = await service.create(userId, dto);

      expect(result).toEqual(mockWalk);
      expect(dogRepo.findOne).toHaveBeenCalledWith({
        where: { id: dto.dogId, userId },
      });
      expect(walkRepo.create).toHaveBeenCalledWith(dto);
      expect(walkRepo.save).toHaveBeenCalledWith(mockWalk);
    });

    it('should throw ForbiddenException if dog not owned', async () => {
      dogRepo.findOne.mockResolvedValue(null);

      await expect(
        service.create(userId, { dogId, startTime: new Date(), distance: 0, duration: 0 }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should remove the walk', async () => {
      const walk = { ...mockWalk, dog: { userId } as Dog } as Walk;
      walkRepo.findOne.mockResolvedValue(walk);
      walkRepo.remove.mockResolvedValue(walk);

      await service.remove('walk-1', userId);

      expect(walkRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'walk-1' },
        relations: ['dog'],
      });
      expect(walkRepo.remove).toHaveBeenCalledWith(walk);
    });

    it('should throw NotFoundException if walk not found', async () => {
      walkRepo.findOne.mockResolvedValue(null);

      await expect(service.remove('walk-1', userId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if walk not owned by user', async () => {
      const walk = {
        ...mockWalk,
        dog: { userId: 'other-user' } as Dog,
      } as Walk;
      walkRepo.findOne.mockResolvedValue(walk);

      await expect(service.remove('walk-1', userId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
