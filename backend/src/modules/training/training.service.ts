import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dog } from '../../entities/dog.entity';
import { DogProgress } from '../../entities/dog-progress.entity';
import { CompletedExercise } from '../../entities/completed-exercise.entity';
import { SkillFreshness } from '../../entities/skill-freshness.entity';
import { EarnedBadge } from '../../entities/earned-badge.entity';
import { ChallengeProgress } from '../../entities/challenge-progress.entity';
import { LeaderboardEntry } from '../../entities/leaderboard-entry.entity';
import { JournalEntry } from '../../entities/journal-entry.entity';
import { UnlockedReward } from '../../entities/unlocked-reward.entity';
import { TRAINING_PROGRAMS } from '../../data/programs';
import { BADGE_DEFS, checkBadgeCondition } from '../../data/badges';
import { getActiveChallenge, getChallengeDay, getWeekNumber } from '../../data/challenges';
import { STREAK_MILESTONES } from '../../data/streakRewards';
import type { CompleteExerciseDto } from './dto';

@Injectable()
export class TrainingService {
  constructor(
    @InjectRepository(DogProgress) private progressRepo: Repository<DogProgress>,
    @InjectRepository(CompletedExercise) private completedRepo: Repository<CompletedExercise>,
    @InjectRepository(SkillFreshness) private freshnessRepo: Repository<SkillFreshness>,
    @InjectRepository(EarnedBadge) private badgeRepo: Repository<EarnedBadge>,
    @InjectRepository(ChallengeProgress) private challengeRepo: Repository<ChallengeProgress>,
    @InjectRepository(LeaderboardEntry) private leaderboardRepo: Repository<LeaderboardEntry>,
    @InjectRepository(JournalEntry) private journalRepo: Repository<JournalEntry>,
    @InjectRepository(UnlockedReward) private rewardRepo: Repository<UnlockedReward>,
    @InjectRepository(Dog) private dogRepo: Repository<Dog>,
  ) {}

  async getOrCreateProgress(dogId: string, userId: string): Promise<DogProgress> {
    const dog = await this.dogRepo.findOne({ where: { id: dogId, userId } });
    if (!dog) throw new NotFoundException('Dog not found');

    let progress = await this.progressRepo.findOne({ where: { dogId } });
    if (!progress) {
      progress = this.progressRepo.create({ dogId });
      progress = await this.progressRepo.save(progress);
    }
    return progress;
  }

  async completeExercise(userId: string, dto: CompleteExerciseDto) {
    const { dogId, exerciseId, levelId, programId, journal } = dto;

    const dog = await this.dogRepo.findOne({ where: { id: dogId, userId } });
    if (!dog) throw new NotFoundException('Dog not found');

    const program = TRAINING_PROGRAMS.find(p => p.id === programId);
    if (!program) throw new BadRequestException('Program not found');
    const level = program.levels.find(l => l.id === levelId);
    if (!level) throw new BadRequestException('Level not found');
    const exercise = level.exercises.find(e => e.id === exerciseId);
    if (!exercise) throw new BadRequestException('Exercise not found');

    let progress = await this.getOrCreateProgress(dogId, userId);
    const isReview = progress.completedExercises.includes(exerciseId);

    // XP calculation
    const baseXp = Math.round(level.xpReward / level.exercises.length);
    const xp = isReview ? Math.round(baseXp * 0.3) : baseXp;

    // Streak calculation
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    let newStreak = progress.currentStreak;
    let milestoneXp = 0;
    let milestoneUnlock: (typeof STREAK_MILESTONES)[number] | null = null;
    const newBadges: string[] = [];

    if (progress.lastTrainDate !== today) {
      const isConsecutive = progress.lastTrainDate === yesterday;
      newStreak = isConsecutive ? progress.currentStreak + 1 : 1;
      const newBest = Math.max(progress.bestStreak, newStreak);

      // Check streak milestones
      const existingRewards = await this.rewardRepo.find({ where: { userId } });
      const unlockedIds = existingRewards.map(r => r.rewardId);
      const milestone = STREAK_MILESTONES.find(
        m => newStreak >= m.days && !unlockedIds.includes(m.rewardId),
      );
      if (milestone) {
        milestoneXp = milestone.xpBonus || 0;
        milestoneUnlock = milestone;
        await this.rewardRepo.save(
          this.rewardRepo.create({ userId, rewardId: milestone.rewardId, rewardType: milestone.reward }),
        );
      }

      progress.currentStreak = newStreak;
      progress.bestStreak = newBest;
      progress.lastTrainDate = today;
    }

    // Update progress
    if (!isReview) {
      progress.completedExercises = [...progress.completedExercises, exerciseId];
    } else {
      progress.totalReviews += 1;
    }
    progress.totalSessions += 1;
    const totalXpGain = xp + milestoneXp;
    progress.totalXP += totalXpGain;

    // Level completion check
    let levelCompleted = false;
    if (!isReview) {
      const allExercisesDone = level.exercises.every(
        e => e.id === exerciseId || progress.completedExercises.includes(e.id),
      );
      if (allExercisesDone && !progress.completedLevels.includes(levelId)) {
        progress.completedLevels = [...progress.completedLevels, levelId];
        levelCompleted = true;
      }
    }

    await this.progressRepo.save(progress);

    // Save completed exercise record
    await this.completedRepo.save(
      this.completedRepo.create({ dogId, exerciseId, levelId, programId, xpEarned: xp, isReview }),
    );

    // Update skill freshness (spaced repetition)
    const rating = journal?.rating || 3;
    let freshness = await this.freshnessRepo.findOne({ where: { dogId, exerciseId } });
    const oldInterval = freshness?.interval || 3;
    const newInterval = this.getNextInterval(oldInterval, rating);
    if (freshness) {
      freshness.lastCompleted = new Date();
      freshness.interval = newInterval;
      freshness.completions += 1;
    } else {
      freshness = this.freshnessRepo.create({
        dogId, exerciseId, lastCompleted: new Date(), interval: newInterval, completions: 1,
      });
    }
    await this.freshnessRepo.save(freshness);

    // Badge evaluation
    const existingBadges = await this.badgeRepo.find({ where: { dogId } });
    const earnedBadgeIds = existingBadges.map(b => b.badgeId);
    const allFreshness = await this.freshnessRepo.find({ where: { dogId } });
    const allSkillsFresh = allFreshness.length > 0 && allFreshness.every(f => {
      const daysSince = (Date.now() - new Date(f.lastCompleted).getTime()) / 86400000;
      return Math.exp(-daysSince / f.interval) > 0.6;
    });

    const badgeState = {
      totalSessions: progress.totalSessions,
      currentStreak: progress.currentStreak,
      completedExercises: progress.completedExercises,
      completedLevels: progress.completedLevels,
      totalXP: progress.totalXP,
      playerLevel: Math.floor(progress.totalXP / 100) + 1,
      totalReviews: progress.totalReviews,
      journal: await this.journalRepo.find({ where: { dogId } }),
      photoCount: 0,
      dogCount: await this.dogRepo.count({ where: { userId } }),
      todayExercises: await this.completedRepo.count({
        where: { dogId },
      }),
      allSkillsFresh,
      streakBest: progress.bestStreak,
      streakRecovered: false,
      streakFreezesUsed: 0,
      programs: TRAINING_PROGRAMS,
      challengeHistory: [],
      challengeStats: { totalCompleted: 0, bestStreak: 0 },
      bothDogsTrainedToday: false,
    };

    for (const badge of BADGE_DEFS) {
      if (!earnedBadgeIds.includes(badge.id) && checkBadgeCondition(badge.id, badgeState)) {
        await this.badgeRepo.save(this.badgeRepo.create({ dogId, badgeId: badge.id }));
        newBadges.push(badge.id);
      }
    }

    // Challenge auto-complete
    let challengeDayDone = false;
    try {
      const now = new Date();
      const todayDay = getChallengeDay(now);
      const activeChallenge = getActiveChallenge(now);
      if (activeChallenge) {
        const todayTask = activeChallenge.days.find(d => d.day === todayDay);
        if (todayTask && todayTask.exerciseId === exerciseId) {
          const weekNum = getWeekNumber(now);
          let cp = await this.challengeRepo.findOne({
            where: { dogId, challengeId: activeChallenge.id, weekNumber: weekNum },
          });
          if (!cp) {
            cp = this.challengeRepo.create({
              dogId, challengeId: activeChallenge.id, weekNumber: weekNum,
            });
          }
          if (!cp.completedDays.includes(todayDay)) {
            cp.completedDays = [...cp.completedDays, todayDay];
            if (cp.completedDays.length === 7) {
              cp.fullComplete = true;
              cp.badgeEarned = activeChallenge.badgeId;
            }
            await this.challengeRepo.save(cp);
            challengeDayDone = true;
          }
        }
      }
    } catch {
      // Challenge logic is best-effort
    }

    // Leaderboard update
    let lb = await this.leaderboardRepo.findOne({ where: { dogId } });
    if (!lb) {
      lb = this.leaderboardRepo.create({ dogId, dogName: dog.name, breed: dog.breed });
    }
    lb.totalXp = progress.totalXP;
    lb.weeklyXp = (lb.weeklyXp || 0) + totalXpGain;
    lb.currentStreak = progress.currentStreak;
    lb.dogName = dog.name;
    await this.leaderboardRepo.save(lb);

    // Journal entry
    if (journal?.note || (journal?.photos && journal.photos.length > 0)) {
      await this.journalRepo.save(
        this.journalRepo.create({
          dogId,
          exerciseId,
          exerciseName: exercise.name,
          programName: program.name,
          programEmoji: program.emoji,
          note: journal.note || '',
          rating: journal.rating || 3,
          mood: journal.mood || 'happy',
          photos: journal.photos || [],
        }),
      );
    }

    return {
      xpGained: totalXpGain,
      totalXP: progress.totalXP,
      newStreak: progress.currentStreak,
      bestStreak: progress.bestStreak,
      newBadges,
      milestoneUnlock: milestoneUnlock ? {
        rewardId: milestoneUnlock.rewardId,
        reward: milestoneUnlock.reward,
        name: milestoneUnlock.name,
        emoji: milestoneUnlock.emoji,
        xpBonus: milestoneUnlock.xpBonus,
      } : null,
      levelCompleted,
      challengeDayDone,
      isReview,
      completedExercises: progress.completedExercises,
      completedLevels: progress.completedLevels,
      totalSessions: progress.totalSessions,
      totalReviews: progress.totalReviews,
    };
  }

  private getNextInterval(currentInterval: number, rating: number): number {
    if (rating >= 4) return Math.round(currentInterval * 2.0);
    if (rating === 3) return Math.round(currentInterval * 1.2);
    return 1;
  }

  async getProgress(dogId: string, userId: string) {
    const progress = await this.getOrCreateProgress(dogId, userId);
    const badges = await this.badgeRepo.find({ where: { dogId } });
    const freshness = await this.freshnessRepo.find({ where: { dogId } });
    const journal = await this.journalRepo.find({ where: { dogId }, order: { createdAt: 'DESC' } });

    return {
      ...progress,
      earnedBadges: badges.map(b => b.badgeId),
      skillFreshness: Object.fromEntries(
        freshness.map(f => [f.exerciseId, {
          lastCompleted: f.lastCompleted.toISOString(),
          interval: f.interval,
          completions: f.completions,
        }]),
      ),
      journal: journal.map(j => ({
        id: j.id,
        date: j.createdAt.toISOString(),
        exerciseId: j.exerciseId,
        exerciseName: j.exerciseName,
        programName: j.programName,
        programEmoji: j.programEmoji,
        note: j.note,
        rating: j.rating,
        mood: j.mood,
        photos: j.photos,
      })),
    };
  }

  async getSkillHealth(dogId: string, userId: string) {
    await this.getOrCreateProgress(dogId, userId);
    const freshness = await this.freshnessRepo.find({ where: { dogId } });
    return freshness.map(f => {
      const daysSince = (Date.now() - new Date(f.lastCompleted).getTime()) / 86400000;
      const score = Math.exp(-daysSince / f.interval);
      return {
        exerciseId: f.exerciseId,
        score,
        label: score > 0.6 ? 'fresh' : score >= 0.3 ? 'fading' : 'stale',
        lastCompleted: f.lastCompleted.toISOString(),
        interval: f.interval,
        completions: f.completions,
      };
    });
  }
}
