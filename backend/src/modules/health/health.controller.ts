import {
  Controller, Get, Post, Delete, Body, Param, UseGuards,
} from '@nestjs/common';
import { HealthService } from './health.service';
import type {
  CreateWeightRecordDto,
  CreateVaccinationDto,
  CreateVetVisitDto,
  CreateMedicationDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards';
import { CurrentUser } from '../auth/decorators';
import type { User } from '../../entities/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('health')
export class HealthController {
  constructor(private healthService: HealthService) {}

  // Weight Records
  @Get('weight/:dogId')
  getWeightRecords(@Param('dogId') dogId: string, @CurrentUser() user: User) {
    return this.healthService.getWeightRecords(dogId, user.id);
  }

  @Post('weight')
  createWeightRecord(@CurrentUser() user: User, @Body() dto: CreateWeightRecordDto) {
    return this.healthService.createWeightRecord(user.id, dto);
  }

  @Delete('weight/:id')
  deleteWeightRecord(@Param('id') id: string, @CurrentUser() user: User) {
    return this.healthService.deleteWeightRecord(id, user.id);
  }

  // Vaccinations
  @Get('vaccinations/:dogId')
  getVaccinations(@Param('dogId') dogId: string, @CurrentUser() user: User) {
    return this.healthService.getVaccinations(dogId, user.id);
  }

  @Post('vaccinations')
  createVaccination(@CurrentUser() user: User, @Body() dto: CreateVaccinationDto) {
    return this.healthService.createVaccination(user.id, dto);
  }

  @Delete('vaccinations/:id')
  deleteVaccination(@Param('id') id: string, @CurrentUser() user: User) {
    return this.healthService.deleteVaccination(id, user.id);
  }

  // Vet Visits
  @Get('vet-visits/:dogId')
  getVetVisits(@Param('dogId') dogId: string, @CurrentUser() user: User) {
    return this.healthService.getVetVisits(dogId, user.id);
  }

  @Post('vet-visits')
  createVetVisit(@CurrentUser() user: User, @Body() dto: CreateVetVisitDto) {
    return this.healthService.createVetVisit(user.id, dto);
  }

  @Delete('vet-visits/:id')
  deleteVetVisit(@Param('id') id: string, @CurrentUser() user: User) {
    return this.healthService.deleteVetVisit(id, user.id);
  }

  // Medications
  @Get('medications/:dogId')
  getMedications(@Param('dogId') dogId: string, @CurrentUser() user: User) {
    return this.healthService.getMedications(dogId, user.id);
  }

  @Post('medications')
  createMedication(@CurrentUser() user: User, @Body() dto: CreateMedicationDto) {
    return this.healthService.createMedication(user.id, dto);
  }

  @Delete('medications/:id')
  deleteMedication(@Param('id') id: string, @CurrentUser() user: User) {
    return this.healthService.deleteMedication(id, user.id);
  }
}
