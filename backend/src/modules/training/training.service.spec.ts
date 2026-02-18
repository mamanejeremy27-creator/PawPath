import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { TrainingService } from './training.service';
import { Dog } from '../../entities/dog.entity';
import { DogProgress } from '../../entities/dog-progress.entity';
import { CompletedExercise } from '../../entities/completed-exercise.entity';
import { SkillFreshness } from '../../entities/skill-freshness.entity';
import { EarnedBadge } from '../../entities/earned-badge.entity';
import { ChallengeProgress } from '../../entities/challenge-progress.entity';
import { LeaderboardEntry } from '../../entities/leaderboard-entry.entity';
import { JournalEntry } from '../../entities/journal-entry.entity';
import { UnlockedReward } from '../../entities/unlocked-reward.entity';
import { TrainingProgram } from '../../entities/training-program.entity';
import { BadgeDefinition } from '../../entities/badge-definition.entity';
import { ChallengeDefinition } from '../../entities/challenge-definition.entity';
import { StreakMilestone } from '../../entities/streak-milestone.entity';

// Mock data matching the old static data:
// "foundations" program, level "f1" has xpReward=50 and 3 exercises: f1a, f1b, f1c
// So baseXp = Math.round(50/3) = 17

const mockFoundationsProgram: Partial<TrainingProgram> = {
  id: 'foundations',
  name: 'Puppy Foundations',
  emoji: '🐾',
  description: 'Essential training for puppies',
  color: '#4CAF50',
  gradient: 'linear-gradient(135deg, #4CAF50, #8BC34A)',
  unlockLevel: 0,
  difficulty: 'beginner',
  duration: '4 weeks',
  levels: [
    {
      id: 'f1',
      name: 'First Steps',
      xpReward: 50,
      description: 'Level 1',
      exercises: [
        { id: 'f1a', name: 'Name Recognition', duration: 5, difficulty: 1, lifeStages: ['puppy'], description: 'Teach name', steps: ['step1'], tips: 'tip', gear: [] },
        { id: 'f1b', name: 'Eye Contact', duration: 5, difficulty: 1, lifeStages: ['puppy'], description: 'Eye contact', steps: ['step1'], tips: 'tip', gear: [] },
        { id: 'f1c', name: 'Hand Touch', duration: 5, difficulty: 1, lifeStages: ['puppy'], description: 'Hand touch', steps: ['step1'], tips: 'tip', gear: [] },
      ],
    },
  ],
};

const mockBadgeDefs: Partial<BadgeDefinition>[] = [
  { id: 'first_session', name: 'First Session', emoji: '⭐', desc: 'Complete your first session', category: 'training' },
  { id: 'streak_3', name: '3-Day Streak', emoji: '🔥', desc: '3 day streak', category: 'streaks' },
  { id: 'streak_7', name: '7-Day Streak', emoji: '🔥', desc: '7 day streak', category: 'streaks' },
  { id: 'exercises_5', name: '5 Exercises', emoji: '💪', desc: 'Complete 5 exercises', category: 'training' },
  { id: 'level_complete', name: 'Level Complete', emoji: '🏆', desc: 'Complete a level', category: 'training' },
];

const mockStreakMilestones: Partial<StreakMilestone>[] = [
  { id: 1, days: 3, reward: 'badge', rewardId: 'streak-3-days', name: '3 Day Streak', emoji: '🔥', xpBonus: 50, freezeReward: false },
  { id: 2, days: 7, reward: 'badge', rewardId: 'streak-7-days', name: '7 Day Streak', emoji: '🔥', xpBonus: 100, freezeReward: false },
  { id: 3, days: 14, reward: 'badge', rewardId: 'streak-14-days', name: '14 Day Streak', emoji: '🔥', xpBonus: 200, freezeReward: true },
];

function createMockRepo() {
  return {
    findOne: jest.fn(),
    find: jest.fn().mockResolvedValue([]),
    create: jest.fn((data: any) => ({ completedDays: [], ...data })),
    save: jest.fn((entity: any) => Promise.resolve(entity)),
    count: jest.fn().mockResolvedValue(0),
  };
}

describe('TrainingService', () => {
  let service: TrainingService;
  let dogRepo: ReturnType<typeof createMockRepo>;
  let progressRepo: ReturnType<typeof createMockRepo>;
  let completedRepo: ReturnType<typeof createMockRepo>;
  let freshnessRepo: ReturnType<typeof createMockRepo>;
  let badgeRepo: ReturnType<typeof createMockRepo>;
  let challengeRepo: ReturnType<typeof createMockRepo>;
  let leaderboardRepo: ReturnType<typeof createMockRepo>;
  let journalRepo: ReturnType<typeof createMockRepo>;
  let rewardRepo: ReturnType<typeof createMockRepo>;
  let programRepo: ReturnType<typeof createMockRepo>;
  let badgeDefRepo: ReturnType<typeof createMockRepo>;
  let challengeDefRepo: ReturnType<typeof createMockRepo>;
  let milestoneRepo: ReturnType<typeof createMockRepo>;

  const userId = 'user-1';
  const dogId = 'dog-1';

  const mockDog: Partial<Dog> = {
    id: dogId,
    name: 'Rex',
    breed: 'Labrador',
    userId,
  };

  function freshProgress(overrides: Partial<DogProgress> = {}): DogProgress {
    return {
      id: 'progress-1',
      dogId,
      totalXP: 0,
      currentStreak: 0,
      bestStreak: 0,
      lastTrainDate: null as any,
      totalSessions: 0,
      totalReviews: 0,
      completedExercises: [],
      completedLevels: [],
      streakData: {},
      difficultyTracking: {},
      createdAt: new Date(),
      updatedAt: new Date(),
      dog: mockDog as Dog,
      ...overrides,
    };
  }

  // Base DTO for foundations/f1/f1a
  const baseDto = {
    dogId,
    exerciseId: 'f1a',
    levelId: 'f1',
    programId: 'foundations',
  };

  beforeEach(async () => {
    dogRepo = createMockRepo();
    progressRepo = createMockRepo();
    completedRepo = createMockRepo();
    freshnessRepo = createMockRepo();
    badgeRepo = createMockRepo();
    challengeRepo = createMockRepo();
    leaderboardRepo = createMockRepo();
    journalRepo = createMockRepo();
    rewardRepo = createMockRepo();
    programRepo = createMockRepo();
    badgeDefRepo = createMockRepo();
    challengeDefRepo = createMockRepo();
    milestoneRepo = createMockRepo();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrainingService,
        { provide: getRepositoryToken(DogProgress), useValue: progressRepo },
        { provide: getRepositoryToken(CompletedExercise), useValue: completedRepo },
        { provide: getRepositoryToken(SkillFreshness), useValue: freshnessRepo },
        { provide: getRepositoryToken(EarnedBadge), useValue: badgeRepo },
        { provide: getRepositoryToken(ChallengeProgress), useValue: challengeRepo },
        { provide: getRepositoryToken(LeaderboardEntry), useValue: leaderboardRepo },
        { provide: getRepositoryToken(JournalEntry), useValue: journalRepo },
        { provide: getRepositoryToken(UnlockedReward), useValue: rewardRepo },
        { provide: getRepositoryToken(Dog), useValue: dogRepo },
        { provide: getRepositoryToken(TrainingProgram), useValue: programRepo },
        { provide: getRepositoryToken(BadgeDefinition), useValue: badgeDefRepo },
        { provide: getRepositoryToken(ChallengeDefinition), useValue: challengeDefRepo },
        { provide: getRepositoryToken(StreakMilestone), useValue: milestoneRepo },
      ],
    }).compile();

    service = module.get<TrainingService>(TrainingService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /** Shared setup: dog exists, progress exists, no prior badges/freshness, no leaderboard entry */
  function setupStandardMocks(progress?: DogProgress) {
    const prog = progress || freshProgress();
    dogRepo.findOne.mockResolvedValue(mockDog);
    progressRepo.findOne.mockResolvedValue(prog);
    progressRepo.save.mockImplementation((p: any) => Promise.resolve(p));
    freshnessRepo.findOne.mockResolvedValue(null);
    badgeRepo.find.mockResolvedValue([]);
    leaderboardRepo.findOne.mockResolvedValue(null);
    rewardRepo.find.mockResolvedValue([]);
    journalRepo.find.mockResolvedValue([]);
    completedRepo.count.mockResolvedValue(1);
    dogRepo.count.mockResolvedValue(1);
    // Static data repos
    programRepo.findOne.mockResolvedValue(mockFoundationsProgram);
    programRepo.find.mockResolvedValue([mockFoundationsProgram]);
    badgeDefRepo.find.mockResolvedValue(mockBadgeDefs);
    milestoneRepo.find.mockResolvedValue(mockStreakMilestones);
    // No active challenge by default
    challengeDefRepo.find.mockResolvedValue([]);
    return prog;
  }

  describe('completeExercise', () => {
    it('should throw NotFoundException when dog not found', async () => {
      dogRepo.findOne.mockResolvedValue(null);

      await expect(service.completeExercise(userId, baseDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for invalid programId', async () => {
      dogRepo.findOne.mockResolvedValue(mockDog);
      progressRepo.findOne.mockResolvedValue(freshProgress());
      programRepo.findOne.mockResolvedValue(null);

      await expect(
        service.completeExercise(userId, { ...baseDto, programId: 'nonexistent' }),
      ).rejects.toThrow(BadRequestException);
    });

    describe('XP calculation', () => {
      it('should grant full XP for a new exercise', async () => {
        setupStandardMocks();

        const result = await service.completeExercise(userId, baseDto);

        // foundations level f1: xpReward=50, 3 exercises => Math.round(50/3) = 17
        expect(result.xpGained).toBe(17);
        expect(result.isReview).toBe(false);
      });

      it('should grant 30% XP for a review exercise', async () => {
        const prog = freshProgress({
          completedExercises: ['f1a'],
          totalSessions: 1,
        });
        setupStandardMocks(prog);

        const result = await service.completeExercise(userId, baseDto);

        // Review: Math.round(17 * 0.3) = 5
        const baseXp = Math.round(50 / 3); // 17
        const reviewXp = Math.round(baseXp * 0.3); // 5
        expect(result.xpGained).toBe(reviewXp);
        expect(result.isReview).toBe(true);
        expect(result.totalReviews).toBe(1);
      });
    });

    describe('streak logic', () => {
      it('should increment streak when last train was yesterday', async () => {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        const prog = freshProgress({
          currentStreak: 5,
          bestStreak: 5,
          lastTrainDate: yesterday,
        });
        setupStandardMocks(prog);

        const result = await service.completeExercise(userId, baseDto);

        expect(result.newStreak).toBe(6);
        expect(result.bestStreak).toBe(6);
      });

      it('should reset streak to 1 when gap > 1 day', async () => {
        const threeDaysAgo = new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0];
        const prog = freshProgress({
          currentStreak: 10,
          bestStreak: 10,
          lastTrainDate: threeDaysAgo,
        });
        setupStandardMocks(prog);

        const result = await service.completeExercise(userId, baseDto);

        expect(result.newStreak).toBe(1);
        // bestStreak should remain at 10 (max of 10 and 1)
        expect(result.bestStreak).toBe(10);
      });

      it('should not update streak for second exercise on same day', async () => {
        const today = new Date().toISOString().split('T')[0];
        const prog = freshProgress({
          currentStreak: 3,
          bestStreak: 3,
          lastTrainDate: today,
        });
        setupStandardMocks(prog);

        const result = await service.completeExercise(userId, baseDto);

        expect(result.newStreak).toBe(3);
      });

      it('should trigger streak milestone reward and bonus XP', async () => {
        // Streak going from 2 to 3 triggers the 3-day milestone (50 xpBonus)
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        const prog = freshProgress({
          currentStreak: 2,
          bestStreak: 2,
          lastTrainDate: yesterday,
        });
        setupStandardMocks(prog);
        rewardRepo.find.mockResolvedValue([]); // no existing rewards

        const result = await service.completeExercise(userId, baseDto);

        expect(result.newStreak).toBe(3);
        const baseXp = Math.round(50 / 3); // 17
        const milestone = mockStreakMilestones.find(m => m.days === 3)!;
        expect(result.xpGained).toBe(baseXp + milestone.xpBonus!); // 17 + 50 = 67
        expect(result.milestoneUnlock).not.toBeNull();
        expect(result.milestoneUnlock!.rewardId).toBe('streak-3-days');
        expect(result.milestoneUnlock!.xpBonus).toBe(50);
        // Reward should have been saved
        expect(rewardRepo.save).toHaveBeenCalled();
        expect(rewardRepo.create).toHaveBeenCalledWith({
          userId,
          rewardId: milestone.rewardId,
          rewardType: milestone.reward,
        });
      });

      it('should not trigger milestone if already unlocked', async () => {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        const prog = freshProgress({
          currentStreak: 2,
          bestStreak: 2,
          lastTrainDate: yesterday,
        });
        setupStandardMocks(prog);
        // Already have the 3-day reward
        rewardRepo.find.mockResolvedValue([{ rewardId: 'streak-3-days' }]);

        const result = await service.completeExercise(userId, baseDto);

        expect(result.newStreak).toBe(3);
        // No milestone XP — the next unchecked milestone would be 7 days, but streak is only 3
        expect(result.milestoneUnlock).toBeNull();
        const baseXp = Math.round(50 / 3);
        expect(result.xpGained).toBe(baseXp);
      });
    });

    describe('level completion', () => {
      it('should mark level complete when all exercises done', async () => {
        // Already completed f1b and f1c; now completing f1a finishes the level
        const prog = freshProgress({
          completedExercises: ['f1b', 'f1c'],
        });
        setupStandardMocks(prog);

        const result = await service.completeExercise(userId, baseDto);

        expect(result.levelCompleted).toBe(true);
        expect(result.completedLevels).toContain('f1');
      });

      it('should NOT mark level complete when exercises are still missing', async () => {
        // Only f1b done, now completing f1a — f1c is still missing
        const prog = freshProgress({
          completedExercises: ['f1b'],
        });
        setupStandardMocks(prog);

        const result = await service.completeExercise(userId, baseDto);

        expect(result.levelCompleted).toBe(false);
        expect(result.completedLevels).not.toContain('f1');
      });

      it('should NOT re-mark level complete on review', async () => {
        // All exercises done already, this is a review
        const prog = freshProgress({
          completedExercises: ['f1a', 'f1b', 'f1c'],
          completedLevels: ['f1'],
        });
        setupStandardMocks(prog);

        const result = await service.completeExercise(userId, baseDto);

        expect(result.isReview).toBe(true);
        expect(result.levelCompleted).toBe(false);
      });
    });

    describe('badge evaluation', () => {
      it('should award first_session badge on first session', async () => {
        setupStandardMocks();
        badgeRepo.find.mockResolvedValue([]); // no existing badges

        const result = await service.completeExercise(userId, baseDto);

        // After completing: totalSessions becomes 1, which triggers "first_session"
        expect(result.newBadges).toContain('first_session');
      });

      it('should not re-award already earned badges', async () => {
        setupStandardMocks();
        badgeRepo.find.mockResolvedValue([{ badgeId: 'first_session' }]);

        const result = await service.completeExercise(userId, baseDto);

        expect(result.newBadges).not.toContain('first_session');
      });

      it('should award streak badge when streak threshold met', async () => {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        const prog = freshProgress({
          currentStreak: 2,
          bestStreak: 2,
          lastTrainDate: yesterday,
          totalSessions: 5,
          completedExercises: ['f1b'],
        });
        setupStandardMocks(prog);
        badgeRepo.find.mockResolvedValue([{ badgeId: 'first_session' }]);

        const result = await service.completeExercise(userId, baseDto);

        // Streak becomes 3 => "streak_3" badge should be awarded
        expect(result.newBadges).toContain('streak_3');
      });
    });

    describe('challenge auto-completion', () => {
      const mockChallengeDef: Partial<ChallengeDefinition> = {
        id: 'test-challenge',
        name: 'Test Challenge',
        emoji: '',
        description: '',
        color: '',
        bonusXP: 200,
        badgeId: 'challenge-test',
        days: [
          { day: 3, exerciseId: 'f1a', task: 'Do f1a' },
        ],
      };

      it('should mark challenge day done when exercise matches today task', async () => {
        setupStandardMocks();

        // Mock challengeDefRepo to return a challenge
        challengeDefRepo.find.mockResolvedValue([mockChallengeDef]);
        // Spy on private methods to control date logic
        jest.spyOn(service as any, 'getChallengeDay').mockReturnValue(3);
        jest.spyOn(service as any, 'getWeekNumber').mockReturnValue(8);
        challengeRepo.findOne.mockResolvedValue(null);

        const result = await service.completeExercise(userId, baseDto);

        expect(result.challengeDayDone).toBe(true);
        expect(challengeRepo.save).toHaveBeenCalled();
      });

      it('should not mark challenge day done when exercise does not match', async () => {
        setupStandardMocks();

        const noMatchChallenge: Partial<ChallengeDefinition> = {
          ...mockChallengeDef,
          days: [
            { day: 3, exerciseId: 'f2a', task: 'Do f2a' }, // Different exercise
          ],
        };
        challengeDefRepo.find.mockResolvedValue([noMatchChallenge]);
        jest.spyOn(service as any, 'getChallengeDay').mockReturnValue(3);
        jest.spyOn(service as any, 'getWeekNumber').mockReturnValue(8);

        const result = await service.completeExercise(userId, baseDto);

        expect(result.challengeDayDone).toBe(false);
      });

      it('should set fullComplete when all 7 days done', async () => {
        setupStandardMocks();

        const day5Challenge: Partial<ChallengeDefinition> = {
          ...mockChallengeDef,
          days: [
            { day: 5, exerciseId: 'f1a', task: 'Do f1a' },
          ],
        };
        challengeDefRepo.find.mockResolvedValue([day5Challenge]);
        jest.spyOn(service as any, 'getChallengeDay').mockReturnValue(5);
        jest.spyOn(service as any, 'getWeekNumber').mockReturnValue(8);

        // Existing progress with 6 days completed
        const existingCp = {
          dogId,
          challengeId: 'test-challenge',
          weekNumber: 8,
          completedDays: [1, 2, 3, 4, 6, 7],
          fullComplete: false,
          badgeEarned: null,
        };
        challengeRepo.findOne.mockResolvedValue(existingCp);

        await service.completeExercise(userId, baseDto);

        expect(challengeRepo.save).toHaveBeenCalledWith(
          expect.objectContaining({
            completedDays: [1, 2, 3, 4, 6, 7, 5],
            fullComplete: true,
            badgeEarned: 'challenge-test',
          }),
        );
      });
    });

    describe('leaderboard', () => {
      it('should create leaderboard entry when none exists', async () => {
        setupStandardMocks();
        leaderboardRepo.findOne.mockResolvedValue(null);

        await service.completeExercise(userId, baseDto);

        expect(leaderboardRepo.create).toHaveBeenCalledWith({
          dogId,
          dogName: 'Rex',
          breed: 'Labrador',
        });
        expect(leaderboardRepo.save).toHaveBeenCalledWith(
          expect.objectContaining({
            dogId,
            dogName: 'Rex',
            totalXp: 17,
          }),
        );
      });

      it('should update existing leaderboard entry', async () => {
        setupStandardMocks();
        const existingLb = {
          id: 'lb-1',
          dogId,
          dogName: 'Rex',
          breed: 'Labrador',
          totalXp: 100,
          weeklyXp: 50,
          currentStreak: 0,
        };
        leaderboardRepo.findOne.mockResolvedValue(existingLb);

        await service.completeExercise(userId, baseDto);

        expect(leaderboardRepo.save).toHaveBeenCalledWith(
          expect.objectContaining({
            totalXp: 17, // progress.totalXP after update
            weeklyXp: 50 + 17, // existing + gain
          }),
        );
      });
    });

    describe('skill freshness update', () => {
      it('should create freshness record for new exercise', async () => {
        setupStandardMocks();
        freshnessRepo.findOne.mockResolvedValue(null);

        await service.completeExercise(userId, baseDto);

        // Default rating=3, oldInterval=3, getNextInterval(3, 3) = Math.round(3*1.2) = 4
        expect(freshnessRepo.create).toHaveBeenCalledWith(
          expect.objectContaining({
            dogId,
            exerciseId: 'f1a',
            interval: 4,
            completions: 1,
          }),
        );
        expect(freshnessRepo.save).toHaveBeenCalled();
      });

      it('should update existing freshness record', async () => {
        setupStandardMocks();
        const existingFreshness = {
          id: 'fresh-1',
          dogId,
          exerciseId: 'f1a',
          lastCompleted: new Date('2026-02-10'),
          interval: 6,
          completions: 3,
        };
        freshnessRepo.findOne.mockResolvedValue(existingFreshness);

        await service.completeExercise(userId, {
          ...baseDto,
          journal: { rating: 5 },
        });

        // rating=5, oldInterval=6, getNextInterval(6, 5) = Math.round(6*2.0) = 12
        expect(freshnessRepo.save).toHaveBeenCalledWith(
          expect.objectContaining({
            interval: 12,
            completions: 4,
          }),
        );
      });
    });

    describe('journal entry', () => {
      it('should save journal entry when note is provided', async () => {
        setupStandardMocks();

        await service.completeExercise(userId, {
          ...baseDto,
          journal: { note: 'Great session!', rating: 4, mood: 'excited' },
        });

        expect(journalRepo.create).toHaveBeenCalledWith(
          expect.objectContaining({
            dogId,
            exerciseId: 'f1a',
            exerciseName: 'Name Recognition',
            programName: 'Puppy Foundations',
            note: 'Great session!',
            rating: 4,
            mood: 'excited',
            photos: [],
          }),
        );
      });

      it('should NOT save journal entry when no note or photos', async () => {
        setupStandardMocks();

        await service.completeExercise(userId, baseDto);

        // journalRepo.create should not be called for journal (it may be called with other params for badge state)
        const journalSaveCalls = journalRepo.save.mock.calls;
        // The service calls journalRepo.save only if journal?.note or journal?.photos
        // Since baseDto has no journal, journalRepo.save should not be called
        expect(journalSaveCalls.length).toBe(0);
      });
    });
  });

  describe('getSkillHealth', () => {
    it('should compute freshness decay with exp(-daysSince / interval)', async () => {
      dogRepo.findOne.mockResolvedValue(mockDog);
      progressRepo.findOne.mockResolvedValue(freshProgress());

      const now = Date.now();
      const twoDaysAgo = new Date(now - 2 * 86400000);
      freshnessRepo.find.mockResolvedValue([
        {
          exerciseId: 'f1a',
          lastCompleted: twoDaysAgo,
          interval: 5,
          completions: 3,
        },
      ]);

      const result = await service.getSkillHealth(dogId, userId);

      expect(result).toHaveLength(1);
      const skill = result[0];
      expect(skill.exerciseId).toBe('f1a');
      // score = exp(-2/5) = exp(-0.4) ~ 0.6703
      expect(skill.score).toBeCloseTo(Math.exp(-2 / 5), 1);
      expect(skill.label).toBe('fresh'); // > 0.6
      expect(skill.interval).toBe(5);
      expect(skill.completions).toBe(3);
    });

    it('should label as "fading" when score between 0.3 and 0.6', async () => {
      dogRepo.findOne.mockResolvedValue(mockDog);
      progressRepo.findOne.mockResolvedValue(freshProgress());

      // exp(-daysSince/interval) should be between 0.3 and 0.6
      // exp(-3/3) = exp(-1) ~ 0.368 => fading
      const threeDaysAgo = new Date(Date.now() - 3 * 86400000);
      freshnessRepo.find.mockResolvedValue([
        {
          exerciseId: 'f1b',
          lastCompleted: threeDaysAgo,
          interval: 3,
          completions: 1,
        },
      ]);

      const result = await service.getSkillHealth(dogId, userId);

      expect(result[0].label).toBe('fading');
    });

    it('should label as "stale" when score < 0.3', async () => {
      dogRepo.findOne.mockResolvedValue(mockDog);
      progressRepo.findOne.mockResolvedValue(freshProgress());

      // exp(-10/3) = exp(-3.33) ~ 0.036 => stale
      const tenDaysAgo = new Date(Date.now() - 10 * 86400000);
      freshnessRepo.find.mockResolvedValue([
        {
          exerciseId: 'f1c',
          lastCompleted: tenDaysAgo,
          interval: 3,
          completions: 2,
        },
      ]);

      const result = await service.getSkillHealth(dogId, userId);

      expect(result[0].label).toBe('stale');
    });
  });

  describe('getNextInterval (via completeExercise)', () => {
    // We test the private method indirectly through the freshness updates

    it('should double interval when rating >= 4', async () => {
      setupStandardMocks();
      freshnessRepo.findOne.mockResolvedValue(null);

      await service.completeExercise(userId, {
        ...baseDto,
        journal: { rating: 4 },
      });

      // oldInterval=3 (default), getNextInterval(3, 4) = Math.round(3*2.0) = 6
      expect(freshnessRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ interval: 6 }),
      );
    });

    it('should multiply interval by 1.2 when rating = 3', async () => {
      setupStandardMocks();
      freshnessRepo.findOne.mockResolvedValue(null);

      await service.completeExercise(userId, {
        ...baseDto,
        journal: { rating: 3 },
      });

      // oldInterval=3, getNextInterval(3, 3) = Math.round(3*1.2) = 4
      expect(freshnessRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ interval: 4 }),
      );
    });

    it('should reset interval to 1 when rating < 3', async () => {
      setupStandardMocks();
      freshnessRepo.findOne.mockResolvedValue(null);

      await service.completeExercise(userId, {
        ...baseDto,
        journal: { rating: 2 },
      });

      // getNextInterval(3, 2) = 1
      expect(freshnessRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ interval: 1 }),
      );
    });

    it('should use default rating 3 when no journal provided', async () => {
      setupStandardMocks();
      freshnessRepo.findOne.mockResolvedValue(null);

      await service.completeExercise(userId, baseDto);

      // No journal => rating defaults to 3 => interval = Math.round(3*1.2) = 4
      expect(freshnessRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ interval: 4 }),
      );
    });

    it('should double a large interval when rating = 5', async () => {
      setupStandardMocks();
      const existingFreshness = {
        id: 'fresh-1',
        dogId,
        exerciseId: 'f1a',
        lastCompleted: new Date('2026-02-10'),
        interval: 10,
        completions: 5,
      };
      freshnessRepo.findOne.mockResolvedValue(existingFreshness);

      await service.completeExercise(userId, {
        ...baseDto,
        journal: { rating: 5 },
      });

      // getNextInterval(10, 5) = Math.round(10*2.0) = 20
      expect(freshnessRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ interval: 20 }),
      );
    });
  });
});
