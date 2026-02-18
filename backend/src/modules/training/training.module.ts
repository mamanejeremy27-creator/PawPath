import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dog } from '../../entities/dog.entity';
import { DogProgress } from '../../entities/dog-progress.entity';
import { CompletedExercise } from '../../entities/completed-exercise.entity';
import { SkillFreshness } from '../../entities/skill-freshness.entity';
import { EarnedBadge } from '../../entities/earned-badge.entity';
import { ChallengeProgress } from '../../entities/challenge-progress.entity';
import { LeaderboardEntry } from '../../entities/leaderboard-entry.entity';
import { JournalEntry } from '../../entities/journal-entry.entity';
import { UnlockedReward } from '../../entities/unlocked-reward.entity';
import { TrainingController } from './training.controller';
import { TrainingService } from './training.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Dog, DogProgress, CompletedExercise, SkillFreshness,
      EarnedBadge, ChallengeProgress, LeaderboardEntry,
      JournalEntry, UnlockedReward,
    ]),
  ],
  controllers: [TrainingController],
  providers: [TrainingService],
  exports: [TrainingService],
})
export class TrainingModule {}
