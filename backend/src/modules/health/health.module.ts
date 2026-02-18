import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dog } from '../../entities/dog.entity';
import { WeightRecord } from '../../entities/weight-record.entity';
import { Vaccination } from '../../entities/vaccination.entity';
import { VetVisit } from '../../entities/vet-visit.entity';
import { Medication } from '../../entities/medication.entity';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

@Module({
  imports: [TypeOrmModule.forFeature([Dog, WeightRecord, Vaccination, VetVisit, Medication])],
  controllers: [HealthController],
  providers: [HealthService],
  exports: [HealthService],
})
export class HealthModule {}
