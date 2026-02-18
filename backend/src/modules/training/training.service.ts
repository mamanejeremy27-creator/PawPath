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
import { TrainingProgram } from '../../entities/training-program.entity';
import { BadgeDefinition } from '../../entities/badge-definition.entity';
import { ChallengeDefinition } from '../../entities/challenge-definition.entity';
import { StreakMilestone } from '../../entities/streak-milestone.entity';
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
    @InjectRepository(TrainingProgram) private programRepo: Repository<TrainingProgram>,
    @InjectRepository(BadgeDefinition) private badgeDefRepo: Repository<BadgeDefinition>,
    @InjectRepository(ChallengeDefinition) private challengeDefRepo: Repository<ChallengeDefinition>,
    @InjectRepository(StreakMilestone) private milestoneRepo: Repository<StreakMilestone>,
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

    const program = await this.programRepo.findOne({ where: { id: programId } });
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
    let milestoneUnlock: StreakMilestone | null = null;
    const newBadges: string[] = [];

    if (progress.lastTrainDate !== today) {
      const isConsecutive = progress.lastTrainDate === yesterday;
      newStreak = isConsecutive ? progress.currentStreak + 1 : 1;
      const newBest = Math.max(progress.bestStreak, newStreak);

      // Check streak milestones
      const existingRewards = await this.rewardRepo.find({ where: { userId } });
      const unlockedIds = existingRewards.map(r => r.rewardId);
      const allMilestones = await this.milestoneRepo.find({ order: { days: 'ASC' } });
      const milestone = allMilestones.find(
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

    const allPrograms = await this.programRepo.find();
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
      programs: allPrograms,
      challengeHistory: [],
      challengeStats: { totalCompleted: 0, bestStreak: 0 },
      bothDogsTrainedToday: false,
    };

    const badgeDefs = await this.badgeDefRepo.find();
    for (const badge of badgeDefs) {
      if (!earnedBadgeIds.includes(badge.id) && this.checkBadgeCondition(badge.id, badgeState)) {
        await this.badgeRepo.save(this.badgeRepo.create({ dogId, badgeId: badge.id }));
        newBadges.push(badge.id);
      }
    }

    // Challenge auto-complete
    let challengeDayDone = false;
    try {
      const now = new Date();
      const todayDay = this.getChallengeDay(now);
      const activeChallenge = await this.getActiveChallenge(now);
      if (activeChallenge) {
        const todayTask = activeChallenge.days.find(d => d.day === todayDay);
        if (todayTask && todayTask.exerciseId === exerciseId) {
          const weekNum = this.getWeekNumber(now);
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

  private getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((((d as any) - (yearStart as any)) / 86400000) + 1) / 7);
  }

  private getChallengeDay(date: Date): number {
    const day = date.getDay();
    return day === 0 ? 7 : day;
  }

  private async getActiveChallenge(date: Date): Promise<ChallengeDefinition | null> {
    const week = this.getWeekNumber(date);
    const challenges = await this.challengeDefRepo.find();
    if (challenges.length === 0) return null;
    return challenges[week % challenges.length];
  }

  private isProgramComplete(progId: string, state: any): boolean {
    if (!state.programs) return false;
    const prog = state.programs.find((p: any) => p.id === progId);
    if (!prog) return false;
    return prog.levels.every((l: any) => l.exercises.every((e: any) => state.completedExercises.includes(e.id)));
  }

  private checkBadgeCondition(badgeId: string, state: any): boolean {
    switch (badgeId) {
      // Streaks
      case "first_session": return state.totalSessions >= 1;
      case "streak_3": return state.currentStreak >= 3;
      case "streak_7": return state.currentStreak >= 7;
      case "streak_14": return state.currentStreak >= 14;
      case "streak_30": return state.currentStreak >= 30;
      case "streak_60": return state.currentStreak >= 60;
      case "streak_90": return state.currentStreak >= 90;
      case "streak_365": return state.currentStreak >= 365;
      // Training - exercises
      case "exercises_5": return state.completedExercises.length >= 5;
      case "exercises_25": return state.completedExercises.length >= 25;
      case "exercises_50": return state.completedExercises.length >= 50;
      case "exercises_100": return state.completedExercises.length >= 100;
      // Training - levels & XP
      case "level_complete": return state.completedLevels.length >= 1;
      case "level_5": return (state.playerLevel || 1) >= 5;
      case "level_10": return (state.playerLevel || 1) >= 10;
      case "xp_500": return state.totalXP >= 500;
      case "xp_1000": return state.totalXP >= 1000;
      case "xp_2500": return state.totalXP >= 2500;
      case "xp_5000": return state.totalXP >= 5000;
      case "xp_10000": return state.totalXP >= 10000;
      // Training - sessions
      case "sessions_10": return state.totalSessions >= 10;
      case "quick_learner": return state.todayExercises >= 3;
      // Programs
      case "prog_foundations": return this.isProgramComplete("foundations", state);
      case "prog_potty": return this.isProgramComplete("potty", state);
      case "prog_crate": return this.isProgramComplete("crate", state);
      case "prog_social": return this.isProgramComplete("social", state);
      case "prog_behavior": return this.isProgramComplete("behavior", state);
      case "prog_obedience": return this.isProgramComplete("obedience", state);
      case "prog_tricks": return this.isProgramComplete("tricks", state);
      case "prog_reactivity": return this.isProgramComplete("reactivity", state);
      case "prog_fitness": return this.isProgramComplete("fitness", state);
      // Journal
      case "journal_5": return state.journal.length >= 5;
      case "journal_20": return state.journal.length >= 20;
      case "journal_50": return state.journal.length >= 50;
      case "first_photo": return (state.photoCount || 0) >= 1;
      case "photos_10": return (state.photoCount || 0) >= 10;
      case "photos_25": return (state.photoCount || 0) >= 25;
      // Skills
      case "caretaker": return (state.totalReviews || 0) >= 10;
      case "maintenance_master": return state.allSkillsFresh && state.completedExercises.length >= 5;
      case "skill_guardian": return state.allSkillsFresh && (state.totalReviews || 0) >= 30;
      // Special
      case "double_trouble": return (state.dogCount || 1) >= 2;
      case "pack_leader": return state.bothDogsTrainedToday === true;
      // Streak rewards
      case "streak-3-days": return (state.streakBest || state.currentStreak) >= 3;
      case "streak-7-days": return (state.streakBest || state.currentStreak) >= 7;
      case "streak-14-days": return (state.streakBest || state.currentStreak) >= 14;
      case "streak-30-days": return (state.streakBest || state.currentStreak) >= 30;
      case "streak-60-days": return (state.streakBest || state.currentStreak) >= 60;
      case "streak-90-days": return (state.streakBest || state.currentStreak) >= 90;
      case "streak-180-days": return (state.streakBest || state.currentStreak) >= 180;
      case "streak-365-days": return (state.streakBest || state.currentStreak) >= 365;
      case "streak-recovered": return state.streakRecovered === true;
      case "streak-freeze-used": return (state.streakFreezesUsed || 0) >= 1;
      // Challenge per-challenge badges
      case "challenge-recall-master":
      case "challenge-patience-guru":
      case "challenge-trick-star":
      case "challenge-leash-pro":
      case "challenge-puppy-grad":
      case "challenge-social-butterfly":
      case "challenge-fitness-champ":
      case "challenge-crate-lover":
      case "challenge-behavior-boss":
      case "challenge-potty-pro":
      case "challenge-laser-focus":
      case "challenge-adventurer": {
        const ch = state.challengeHistory || [];
        return ch.some((h: any) => h.badgeEarned === badgeId && h.fullComplete);
      }
      // Challenge meta badges
      case "challenge-first-complete": return (state.challengeStats?.totalCompleted || 0) >= 1;
      case "challenge-5-complete": return (state.challengeStats?.totalCompleted || 0) >= 5;
      case "challenge-streak-3": return (state.challengeStats?.bestStreak || 0) >= 3;
      case "challenge-partial-hero": {
        const ch2 = state.challengeHistory || [];
        return ch2.some((h: any) => h.completedDays.length >= 5);
      }
      default: return false;
    }
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
