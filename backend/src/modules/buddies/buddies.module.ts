import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuddyRequest } from '../../entities/buddy-request.entity';
import { Dog } from '../../entities/dog.entity';
import { DogProgress } from '../../entities/dog-progress.entity';
import { LeaderboardEntry } from '../../entities/leaderboard-entry.entity';
import { User } from '../../entities/user.entity';
import { BuddiesController } from './buddies.controller';
import { BuddiesService } from './buddies.service';

@Module({
  imports: [TypeOrmModule.forFeature([BuddyRequest, Dog, DogProgress, LeaderboardEntry, User])],
  controllers: [BuddiesController],
  providers: [BuddiesService],
  exports: [BuddiesService],
})
export class BuddiesModule {}
