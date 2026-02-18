import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dog } from '../../entities/dog.entity';
import { WeightRecord } from '../../entities/weight-record.entity';
import { Vaccination } from '../../entities/vaccination.entity';
import { VetVisit } from '../../entities/vet-visit.entity';
import { Medication } from '../../entities/medication.entity';
import type {
  CreateWeightRecordDto,
  CreateVaccinationDto,
  CreateVetVisitDto,
  CreateMedicationDto,
} from './dto';

@Injectable()
export class HealthService {
  constructor(
    @InjectRepository(Dog) private dogRepo: Repository<Dog>,
    @InjectRepository(WeightRecord) private weightRepo: Repository<WeightRecord>,
    @InjectRepository(Vaccination) private vaccinationRepo: Repository<Vaccination>,
    @InjectRepository(VetVisit) private vetVisitRepo: Repository<VetVisit>,
    @InjectRepository(Medication) private medicationRepo: Repository<Medication>,
  ) {}

  private async verifyDogOwnership(dogId: string, userId: string): Promise<Dog> {
    const dog = await this.dogRepo.findOne({ where: { id: dogId, userId } });
    if (!dog) throw new ForbiddenException('Dog not found or not owned by user');
    return dog;
  }

  // Weight Records
  async getWeightRecords(dogId: string, userId: string) {
    await this.verifyDogOwnership(dogId, userId);
    return this.weightRepo.find({ where: { dogId }, order: { date: 'DESC' } });
  }

  async createWeightRecord(userId: string, dto: CreateWeightRecordDto) {
    await this.verifyDogOwnership(dto.dogId, userId);
    const record = this.weightRepo.create(dto);
    return this.weightRepo.save(record);
  }

  async deleteWeightRecord(id: string, userId: string) {
    const record = await this.weightRepo.findOne({ where: { id }, relations: ['dog'] });
    if (!record) throw new NotFoundException('Weight record not found');
    if (record.dog.userId !== userId) throw new ForbiddenException();
    await this.weightRepo.remove(record);
  }

  // Vaccinations
  async getVaccinations(dogId: string, userId: string) {
    await this.verifyDogOwnership(dogId, userId);
    return this.vaccinationRepo.find({ where: { dogId }, order: { date: 'DESC' } });
  }

  async createVaccination(userId: string, dto: CreateVaccinationDto) {
    await this.verifyDogOwnership(dto.dogId, userId);
    const record = this.vaccinationRepo.create(dto);
    return this.vaccinationRepo.save(record);
  }

  async deleteVaccination(id: string, userId: string) {
    const record = await this.vaccinationRepo.findOne({ where: { id }, relations: ['dog'] });
    if (!record) throw new NotFoundException('Vaccination not found');
    if (record.dog.userId !== userId) throw new ForbiddenException();
    await this.vaccinationRepo.remove(record);
  }

  // Vet Visits
  async getVetVisits(dogId: string, userId: string) {
    await this.verifyDogOwnership(dogId, userId);
    return this.vetVisitRepo.find({ where: { dogId }, order: { date: 'DESC' } });
  }

  async createVetVisit(userId: string, dto: CreateVetVisitDto) {
    await this.verifyDogOwnership(dto.dogId, userId);
    const record = this.vetVisitRepo.create(dto);
    return this.vetVisitRepo.save(record);
  }

  async deleteVetVisit(id: string, userId: string) {
    const record = await this.vetVisitRepo.findOne({ where: { id }, relations: ['dog'] });
    if (!record) throw new NotFoundException('Vet visit not found');
    if (record.dog.userId !== userId) throw new ForbiddenException();
    await this.vetVisitRepo.remove(record);
  }

  // Medications
  async getMedications(dogId: string, userId: string) {
    await this.verifyDogOwnership(dogId, userId);
    return this.medicationRepo.find({ where: { dogId }, order: { startDate: 'DESC' } });
  }

  async createMedication(userId: string, dto: CreateMedicationDto) {
    await this.verifyDogOwnership(dto.dogId, userId);
    const record = this.medicationRepo.create(dto);
    return this.medicationRepo.save(record);
  }

  async deleteMedication(id: string, userId: string) {
    const record = await this.medicationRepo.findOne({ where: { id }, relations: ['dog'] });
    if (!record) throw new NotFoundException('Medication not found');
    if (record.dog.userId !== userId) throw new ForbiddenException();
    await this.medicationRepo.remove(record);
  }
}
