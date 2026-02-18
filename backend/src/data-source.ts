import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from './entities/user.entity';
import { Dog } from './entities/dog.entity';
import { DogProgress } from './entities/dog-progress.entity';
import { CompletedExercise } from './entities/completed-exercise.entity';
import { SkillFreshness } from './entities/skill-freshness.entity';
import { EarnedBadge } from './entities/earned-badge.entity';
import { StreakHistory } from './entities/streak-history.entity';
import { ChallengeProgress } from './entities/challenge-progress.entity';
import { UnlockedReward } from './entities/unlocked-reward.entity';
import { LeaderboardEntry } from './entities/leaderboard-entry.entity';
import { JournalEntry } from './entities/journal-entry.entity';
import { UserSettings } from './entities/user-settings.entity';
import { WeightRecord } from './entities/weight-record.entity';
import { Vaccination } from './entities/vaccination.entity';
import { VetVisit } from './entities/vet-visit.entity';
import { Medication } from './entities/medication.entity';
import { Walk } from './entities/walk.entity';
import { Post } from './entities/post.entity';
import { PostLike } from './entities/post-like.entity';
import { Comment } from './entities/comment.entity';
import { BuddyRequest } from './entities/buddy-request.entity';
import { LostDogReport } from './entities/lost-dog-report.entity';
import { Sighting } from './entities/sighting.entity';
import { Feedback } from './entities/feedback.entity';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5435'),
  username: process.env.DB_USERNAME || 'pawpath',
  password: process.env.DB_PASSWORD || 'pawpath_dev',
  database: process.env.DB_DATABASE || 'pawpath',
  entities: [
    User, Dog, DogProgress, CompletedExercise, SkillFreshness,
    EarnedBadge, StreakHistory, ChallengeProgress, UnlockedReward,
    LeaderboardEntry, JournalEntry,
    UserSettings, WeightRecord, Vaccination, VetVisit, Medication,
    Walk, Post, PostLike, Comment, BuddyRequest,
    LostDogReport, Sighting, Feedback,
  ],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
});
