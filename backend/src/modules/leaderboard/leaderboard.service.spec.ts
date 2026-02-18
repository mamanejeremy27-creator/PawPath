import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaderboardService } from './leaderboard.service';
import { LeaderboardEntry } from '../../entities/leaderboard-entry.entity';

describe('LeaderboardService', () => {
  let service: LeaderboardService;
  let leaderboardRepo: jest.Mocked<Partial<Repository<LeaderboardEntry>>>;

  const mockEntries: LeaderboardEntry[] = [
    {
      id: 'lb-1',
      dogId: 'dog-1',
      dog: undefined,
      dogName: 'Rex',
      breed: 'German Shepherd',
      totalXp: 1000,
      weeklyXp: 200,
      currentStreak: 5,
      weekStart: '2024-01-15',
      updatedAt: new Date(),
    },
    {
      id: 'lb-2',
      dogId: 'dog-2',
      dog: undefined,
      dogName: 'Bella',
      breed: 'Labrador',
      totalXp: 800,
      weeklyXp: 150,
      currentStreak: 3,
      weekStart: '2024-01-15',
      updatedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    leaderboardRepo = {
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeaderboardService,
        {
          provide: getRepositoryToken(LeaderboardEntry),
          useValue: leaderboardRepo,
        },
      ],
    }).compile();

    service = module.get<LeaderboardService>(LeaderboardService);
  });

  describe('getWeekly', () => {
    it('should return top 50 entries sorted by weeklyXp DESC', async () => {
      leaderboardRepo.find.mockResolvedValue(mockEntries);

      const result = await service.getWeekly();

      expect(result).toEqual(mockEntries);
      expect(leaderboardRepo.find).toHaveBeenCalledWith({
        order: { weeklyXp: 'DESC' },
        take: 50,
      });
    });

    it('should return empty array when no entries exist', async () => {
      leaderboardRepo.find.mockResolvedValue([]);

      const result = await service.getWeekly();

      expect(result).toEqual([]);
    });
  });

  describe('getAllTime', () => {
    it('should return top 50 entries sorted by totalXp DESC', async () => {
      leaderboardRepo.find.mockResolvedValue(mockEntries);

      const result = await service.getAllTime();

      expect(result).toEqual(mockEntries);
      expect(leaderboardRepo.find).toHaveBeenCalledWith({
        order: { totalXp: 'DESC' },
        take: 50,
      });
    });
  });

  describe('getByBreed', () => {
    it('should return entries filtered by breed sorted by totalXp DESC', async () => {
      const filteredEntries = [mockEntries[0]];
      leaderboardRepo.find.mockResolvedValue(filteredEntries);

      const result = await service.getByBreed('German Shepherd');

      expect(result).toEqual(filteredEntries);
      expect(leaderboardRepo.find).toHaveBeenCalledWith({
        where: { breed: 'German Shepherd' },
        order: { totalXp: 'DESC' },
      });
    });

    it('should return empty array when no entries for breed', async () => {
      leaderboardRepo.find.mockResolvedValue([]);

      const result = await service.getByBreed('Poodle');

      expect(result).toEqual([]);
    });
  });
});
