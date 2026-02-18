import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Walk } from '../../entities/walk.entity';
import { Dog } from '../../entities/dog.entity';
import { WalksController } from './walks.controller';
import { WalksService } from './walks.service';

@Module({
  imports: [TypeOrmModule.forFeature([Walk, Dog])],
  controllers: [WalksController],
  providers: [WalksService],
  exports: [WalksService],
})
export class WalksModule {}
