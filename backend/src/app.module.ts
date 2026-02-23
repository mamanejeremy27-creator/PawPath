import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import {
  User, Dog, DogProgress, CompletedExercise, SkillFreshness,
  EarnedBadge, StreakHistory, ChallengeProgress, UnlockedReward,
  LeaderboardEntry, JournalEntry,
  UserSettings, WeightRecord, Vaccination, VetVisit, Medication,
  Walk, Post, PostLike, Comment, BuddyRequest,
  LostDogReport, Sighting, Feedback,
  TrainingProgram, BadgeDefinition, ChallengeDefinition, StreakMilestone,
} from './entities';
import { AuthModule } from './modules/auth/auth.module';
import { DogsModule } from './modules/dogs/dogs.module';
import { TrainingModule } from './modules/training/training.module';
import { SettingsModule } from './modules/settings/settings.module';
import { HealthModule } from './modules/health/health.module';
import { WalksModule } from './modules/walks/walks.module';
import { CommunityModule } from './modules/community/community.module';
import { LeaderboardModule } from './modules/leaderboard/leaderboard.module';
import { BuddiesModule } from './modules/buddies/buddies.module';
import { LostDogsModule } from './modules/lost-dogs/lost-dogs.module';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { SeedModule } from './modules/seed/seed.module';
import { TtsModule } from './modules/tts/tts.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // Support DATABASE_URL (provided by Railway PostgreSQL plugin)
        // or fall back to individual DB_* vars (local dev)
        const databaseUrl = configService.get<string>('DATABASE_URL');
        const dbConn = databaseUrl
          ? (() => {
              const u = new URL(databaseUrl);
              return {
                host: u.hostname,
                port: parseInt(u.port || '5432', 10),
                username: u.username,
                password: u.password,
                database: u.pathname.slice(1),
                ssl: { rejectUnauthorized: false },
              };
            })()
          : {
              host: configService.get('DB_HOST', 'localhost'),
              port: configService.get<number>('DB_PORT', 5435),
              username: configService.get('DB_USERNAME', 'pawpath'),
              password: configService.get('DB_PASSWORD', 'pawpath_dev'),
              database: configService.get('DB_DATABASE', 'pawpath'),
            };
        return {
          type: 'postgres' as const,
          ...dbConn,
          entities: [
            User, Dog, DogProgress, CompletedExercise, SkillFreshness,
            EarnedBadge, StreakHistory, ChallengeProgress, UnlockedReward,
            LeaderboardEntry, JournalEntry,
            UserSettings, WeightRecord, Vaccination, VetVisit, Medication,
            Walk, Post, PostLike, Comment, BuddyRequest,
            LostDogReport, Sighting, Feedback,
            TrainingProgram, BadgeDefinition, ChallengeDefinition, StreakMilestone,
          ],
          migrations: ['dist/migrations/*.js'],
          migrationsRun: true,
          synchronize: true,
          logging: configService.get('NODE_ENV') === 'development',
        };
      },
    }),
    AuthModule,
    DogsModule,
    TrainingModule,
    SettingsModule,
    HealthModule,
    WalksModule,
    CommunityModule,
    LeaderboardModule,
    BuddiesModule,
    LostDogsModule,
    FeedbackModule,
    SeedModule,
    TtsModule,
  ],
  controllers: [],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
