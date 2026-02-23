import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { BuddiesService } from './buddies.service';
import { BuddyRequest } from '../../entities/buddy-request.entity';
import { Dog } from '../../entities/dog.entity';
import { DogProgress } from '../../entities/dog-progress.entity';
import { LeaderboardEntry } from '../../entities/leaderboard-entry.entity';
import { User } from '../../entities/user.entity';

describe('BuddiesService', () => {
  let service: BuddiesService;
  let buddyRepo: jest.Mocked<Partial<Repository<BuddyRequest>>>;

  const userId = 'user-1';
  const otherUserId = 'user-2';

  beforeEach(async () => {
    buddyRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
      count: jest.fn(),
    };

    const emptyRepo = {
      find: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue(null),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BuddiesService,
        { provide: getRepositoryToken(BuddyRequest), useValue: buddyRepo },
        { provide: getRepositoryToken(Dog), useValue: emptyRepo },
        { provide: getRepositoryToken(DogProgress), useValue: emptyRepo },
        { provide: getRepositoryToken(LeaderboardEntry), useValue: emptyRepo },
        { provide: getRepositoryToken(User), useValue: emptyRepo },
      ],
    }).compile();

    service = module.get<BuddiesService>(BuddiesService);
  });

  describe('listBuddies', () => {
    it('should return accepted buddy requests for the user', async () => {
      const buddies = [
        { id: 'b-1', fromUserId: userId, toUserId: otherUserId, status: 'accepted' },
      ] as BuddyRequest[];
      buddyRepo.find.mockResolvedValue(buddies);

      const result = await service.listBuddies(userId);

      expect(result).toEqual(buddies);
      expect(buddyRepo.find).toHaveBeenCalledWith({
        where: [
          { fromUserId: userId, status: 'accepted' },
          { toUserId: userId, status: 'accepted' },
        ],
        relations: ['fromUser', 'toUser'],
      });
    });
  });

  describe('sendRequest', () => {
    it('should create and save a buddy request', async () => {
      const request = {
        id: 'b-1',
        fromUserId: userId,
        toUserId: otherUserId,
        status: 'pending',
      } as BuddyRequest;
      buddyRepo.count.mockResolvedValue(0);
      buddyRepo.findOne.mockResolvedValue(null);
      buddyRepo.create.mockReturnValue(request);
      buddyRepo.save.mockResolvedValue(request);

      const result = await service.sendRequest(userId, otherUserId);

      expect(result).toEqual(request);
      expect(buddyRepo.create).toHaveBeenCalledWith({
        fromUserId: userId,
        toUserId: otherUserId,
      });
    });

    it('should throw BadRequestException when sending to yourself', async () => {
      await expect(service.sendRequest(userId, userId)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.sendRequest(userId, userId)).rejects.toThrow(
        'Cannot send buddy request to yourself',
      );
    });

    it('should throw BadRequestException when max buddies reached', async () => {
      buddyRepo.count.mockResolvedValue(3);

      await expect(
        service.sendRequest(userId, otherUserId),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.sendRequest(userId, otherUserId),
      ).rejects.toThrow('Maximum 3 buddies allowed');
    });

    it('should throw BadRequestException when request already exists', async () => {
      buddyRepo.count.mockResolvedValue(0);
      buddyRepo.findOne.mockResolvedValue({
        id: 'b-1',
        fromUserId: userId,
        toUserId: otherUserId,
      } as BuddyRequest);

      await expect(
        service.sendRequest(userId, otherUserId),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.sendRequest(userId, otherUserId),
      ).rejects.toThrow('Buddy request already exists');
    });
  });

  describe('accept', () => {
    it('should accept a pending buddy request', async () => {
      const request = {
        id: 'b-1',
        fromUserId: otherUserId,
        toUserId: userId,
        status: 'pending',
      } as BuddyRequest;
      const acceptedRequest = { ...request, status: 'accepted' } as BuddyRequest;
      buddyRepo.findOne.mockResolvedValue(request);
      buddyRepo.save.mockResolvedValue(acceptedRequest);

      const result = await service.accept('b-1', userId);

      expect(result).toEqual(acceptedRequest);
      expect(buddyRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'b-1', toUserId: userId, status: 'pending' },
      });
      expect(buddyRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'accepted' }),
      );
    });

    it('should throw NotFoundException when request not found', async () => {
      buddyRepo.findOne.mockResolvedValue(null);

      await expect(service.accept('b-1', userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('reject', () => {
    it('should reject a pending buddy request', async () => {
      const request = {
        id: 'b-1',
        fromUserId: otherUserId,
        toUserId: userId,
        status: 'pending',
      } as BuddyRequest;
      const rejectedRequest = { ...request, status: 'rejected' } as BuddyRequest;
      buddyRepo.findOne.mockResolvedValue(request);
      buddyRepo.save.mockResolvedValue(rejectedRequest);

      const result = await service.reject('b-1', userId);

      expect(result).toEqual(rejectedRequest);
      expect(buddyRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'b-1', toUserId: userId, status: 'pending' },
      });
      expect(buddyRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'rejected' }),
      );
    });

    it('should throw NotFoundException when request not found', async () => {
      buddyRepo.findOne.mockResolvedValue(null);

      await expect(service.reject('b-1', userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a buddy request as the sender', async () => {
      const request = {
        id: 'b-1',
        fromUserId: userId,
        toUserId: otherUserId,
      } as BuddyRequest;
      buddyRepo.findOne.mockResolvedValue(request);
      buddyRepo.remove.mockResolvedValue(request);

      await service.remove('b-1', userId);

      expect(buddyRepo.findOne).toHaveBeenCalledWith({
        where: [
          { id: 'b-1', fromUserId: userId },
          { id: 'b-1', toUserId: userId },
        ],
      });
      expect(buddyRepo.remove).toHaveBeenCalledWith(request);
    });

    it('should throw NotFoundException when buddy not found', async () => {
      buddyRepo.findOne.mockResolvedValue(null);

      await expect(service.remove('b-1', userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
