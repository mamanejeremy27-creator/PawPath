import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LostDogReport } from '../../entities/lost-dog-report.entity';
import { Sighting } from '../../entities/sighting.entity';
import { LostDogsController } from './lost-dogs.controller';
import { LostDogsService } from './lost-dogs.service';

@Module({
  imports: [TypeOrmModule.forFeature([LostDogReport, Sighting])],
  controllers: [LostDogsController],
  providers: [LostDogsService],
  exports: [LostDogsService],
})
export class LostDogsModule {}
