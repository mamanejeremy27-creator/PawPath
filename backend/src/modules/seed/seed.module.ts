import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  TrainingProgram,
  BadgeDefinition,
  ChallengeDefinition,
  StreakMilestone,
} from '../../entities';
import { SeedService } from './seed.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TrainingProgram,
      BadgeDefinition,
      ChallengeDefinition,
      StreakMilestone,
    ]),
  ],
  providers: [SeedService],
})
export class SeedModule {}
