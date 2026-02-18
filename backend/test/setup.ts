import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';
import { AuthModule } from '../src/modules/auth/auth.module';
import { DogsModule } from '../src/modules/dogs/dogs.module';
import { TrainingModule } from '../src/modules/training/training.module';
import { SettingsModule } from '../src/modules/settings/settings.module';
import { HealthModule } from '../src/modules/health/health.module';
import { WalksModule } from '../src/modules/walks/walks.module';
import { CommunityModule } from '../src/modules/community/community.module';
import { LeaderboardModule } from '../src/modules/leaderboard/leaderboard.module';
import { BuddiesModule } from '../src/modules/buddies/buddies.module';
import { LostDogsModule } from '../src/modules/lost-dogs/lost-dogs.module';
import { FeedbackModule } from '../src/modules/feedback/feedback.module';
import {
  User, Dog, DogProgress, CompletedExercise, SkillFreshness,
  EarnedBadge, StreakHistory, ChallengeProgress, UnlockedReward,
  LeaderboardEntry, JournalEntry,
  UserSettings, WeightRecord, Vaccination, VetVisit, Medication,
  Walk, Post, PostLike, Comment, BuddyRequest,
  LostDogReport, Sighting, Feedback,
  TrainingProgram, BadgeDefinition, ChallengeDefinition, StreakMilestone,
} from '../src/entities';

const ALL_ENTITIES = [
  User, Dog, DogProgress, CompletedExercise, SkillFreshness,
  EarnedBadge, StreakHistory, ChallengeProgress, UnlockedReward,
  LeaderboardEntry, JournalEntry,
  UserSettings, WeightRecord, Vaccination, VetVisit, Medication,
  Walk, Post, PostLike, Comment, BuddyRequest,
  LostDogReport, Sighting, Feedback,
  TrainingProgram, BadgeDefinition, ChallengeDefinition, StreakMilestone,
];

export async function createTestApp(): Promise<{
  app: INestApplication;
  module: TestingModule;
}> {
  let moduleBuilder: TestingModule;

  try {
    moduleBuilder = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          // Provide inline env values so tests don't depend on .env file
          load: [
            () => ({
              JWT_SECRET: 'pawpath-test-jwt-secret',
              JWT_EXPIRATION: '7d',
            }),
          ],
        }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5435,
          username: 'pawpath',
          password: 'pawpath_dev',
          database: 'pawpath_test',
          entities: ALL_ENTITIES,
          synchronize: true,
          dropSchema: true,
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
      ],
    }).compile();
  } catch (error) {
    const msg =
      `Failed to create test application. ` +
      `Make sure Docker PostgreSQL is running on port 5435 ` +
      `and the "pawpath_test" database exists.\n` +
      `Create it with: PGPASSWORD=pawpath_dev psql -h localhost -p 5435 -U pawpath -d pawpath ` +
      `-c "CREATE DATABASE pawpath_test;"`;
    console.error(msg);
    throw error;
  }

  const app = moduleBuilder.createNestApplication();

  // Match the same configuration as main.ts
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.setGlobalPrefix('api');

  await app.init();

  return { app, module: moduleBuilder };
}
