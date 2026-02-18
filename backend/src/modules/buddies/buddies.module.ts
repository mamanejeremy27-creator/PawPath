import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuddyRequest } from '../../entities/buddy-request.entity';
import { BuddiesController } from './buddies.controller';
import { BuddiesService } from './buddies.service';

@Module({
  imports: [TypeOrmModule.forFeature([BuddyRequest])],
  controllers: [BuddiesController],
  providers: [BuddiesService],
  exports: [BuddiesService],
})
export class BuddiesModule {}
