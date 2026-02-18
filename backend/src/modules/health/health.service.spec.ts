import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { HealthService } from './health.service';
import { Dog } from '../../entities/dog.entity';
import { WeightRecord } from '../../entities/weight-record.entity';
import { Vaccination } from '../../entities/vaccination.entity';
import { VetVisit } from '../../entities/vet-visit.entity';
import { Medication } from '../../entities/medication.entity';

describe('HealthService', () => {
  let service: HealthService;
  let dogRepo: jest.Mocked<Partial<Repository<Dog>>>;
  let weightRepo: jest.Mocked<Partial<Repository<WeightRecord>>>;
  let vaccinationRepo: jest.Mocked<Partial<Repository<Vaccination>>>;
  let vetVisitRepo: jest.Mocked<Partial<Repository<VetVisit>>>;
  let medicationRepo: jest.Mocked<Partial<Repository<Medication>>>;

  const userId = 'user-1';
  const dogId = 'dog-1';
  const mockDog = { id: dogId, userId, name: 'Rex' } as Dog;

  beforeEach(async () => {
    dogRepo = {
      findOne: jest.fn(),
    };
    weightRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };
    vaccinationRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };
    vetVisitRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };
    medicationRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        { provide: getRepositoryToken(Dog), useValue: dogRepo },
        { provide: getRepositoryToken(WeightRecord), useValue: weightRepo },
        { provide: getRepositoryToken(Vaccination), useValue: vaccinationRepo },
        { provide: getRepositoryToken(VetVisit), useValue: vetVisitRepo },
        { provide: getRepositoryToken(Medication), useValue: medicationRepo },
      ],
    }).compile();

    service = module.get<HealthService>(HealthService);
  });

  // --- Weight Records ---
  describe('getWeightRecords', () => {
    it('should return weight records for an owned dog', async () => {
      const records = [{ id: 'wr-1', dogId, weight: 25 }] as WeightRecord[];
      dogRepo.findOne.mockResolvedValue(mockDog);
      weightRepo.find.mockResolvedValue(records);

      const result = await service.getWeightRecords(dogId, userId);

      expect(result).toEqual(records);
      expect(dogRepo.findOne).toHaveBeenCalledWith({
        where: { id: dogId, userId },
      });
      expect(weightRepo.find).toHaveBeenCalledWith({
        where: { dogId },
        order: { date: 'DESC' },
      });
    });

    it('should throw ForbiddenException if dog not owned', async () => {
      dogRepo.findOne.mockResolvedValue(null);

      await expect(
        service.getWeightRecords(dogId, 'other-user'),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('createWeightRecord', () => {
    it('should create a weight record', async () => {
      const dto = { dogId, weight: 28, date: '2024-01-15' };
      const record = { id: 'wr-1', ...dto } as unknown as WeightRecord;
      dogRepo.findOne.mockResolvedValue(mockDog);
      weightRepo.create.mockReturnValue(record);
      weightRepo.save.mockResolvedValue(record);

      const result = await service.createWeightRecord(userId, dto);

      expect(result).toEqual(record);
      expect(weightRepo.create).toHaveBeenCalledWith(dto);
      expect(weightRepo.save).toHaveBeenCalledWith(record);
    });

    it('should throw ForbiddenException if dog not owned', async () => {
      dogRepo.findOne.mockResolvedValue(null);

      await expect(
        service.createWeightRecord(userId, { dogId, weight: 28, date: '2024-01-15' }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('deleteWeightRecord', () => {
    it('should delete the weight record', async () => {
      const record = {
        id: 'wr-1',
        dogId,
        dog: { userId } as Dog,
      } as WeightRecord;
      weightRepo.findOne.mockResolvedValue(record);
      weightRepo.remove.mockResolvedValue(record);

      await service.deleteWeightRecord('wr-1', userId);

      expect(weightRepo.remove).toHaveBeenCalledWith(record);
    });

    it('should throw NotFoundException if record not found', async () => {
      weightRepo.findOne.mockResolvedValue(null);

      await expect(
        service.deleteWeightRecord('wr-1', userId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if not owned by user', async () => {
      const record = {
        id: 'wr-1',
        dogId,
        dog: { userId: 'other-user' } as Dog,
      } as WeightRecord;
      weightRepo.findOne.mockResolvedValue(record);

      await expect(
        service.deleteWeightRecord('wr-1', userId),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  // --- Vaccinations ---
  describe('getVaccinations', () => {
    it('should return vaccinations for an owned dog', async () => {
      const records = [{ id: 'v-1', dogId, name: 'Rabies' }] as Vaccination[];
      dogRepo.findOne.mockResolvedValue(mockDog);
      vaccinationRepo.find.mockResolvedValue(records);

      const result = await service.getVaccinations(dogId, userId);

      expect(result).toEqual(records);
      expect(vaccinationRepo.find).toHaveBeenCalledWith({
        where: { dogId },
        order: { date: 'DESC' },
      });
    });

    it('should throw ForbiddenException if dog not owned', async () => {
      dogRepo.findOne.mockResolvedValue(null);

      await expect(
        service.getVaccinations(dogId, 'other-user'),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('createVaccination', () => {
    it('should create a vaccination', async () => {
      const dto = { dogId, name: 'Rabies', date: '2024-01-15' };
      const record = { id: 'v-1', ...dto } as unknown as Vaccination;
      dogRepo.findOne.mockResolvedValue(mockDog);
      vaccinationRepo.create.mockReturnValue(record);
      vaccinationRepo.save.mockResolvedValue(record);

      const result = await service.createVaccination(userId, dto);

      expect(result).toEqual(record);
    });
  });

  describe('deleteVaccination', () => {
    it('should delete the vaccination', async () => {
      const record = {
        id: 'v-1',
        dogId,
        dog: { userId } as Dog,
      } as Vaccination;
      vaccinationRepo.findOne.mockResolvedValue(record);
      vaccinationRepo.remove.mockResolvedValue(record);

      await service.deleteVaccination('v-1', userId);

      expect(vaccinationRepo.remove).toHaveBeenCalledWith(record);
    });

    it('should throw NotFoundException if record not found', async () => {
      vaccinationRepo.findOne.mockResolvedValue(null);

      await expect(
        service.deleteVaccination('v-1', userId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if not owned by user', async () => {
      const record = {
        id: 'v-1',
        dogId,
        dog: { userId: 'other-user' } as Dog,
      } as Vaccination;
      vaccinationRepo.findOne.mockResolvedValue(record);

      await expect(
        service.deleteVaccination('v-1', userId),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  // --- Vet Visits ---
  describe('getVetVisits', () => {
    it('should return vet visits for an owned dog', async () => {
      const records = [{ id: 'vv-1', dogId, reason: 'Checkup' }] as VetVisit[];
      dogRepo.findOne.mockResolvedValue(mockDog);
      vetVisitRepo.find.mockResolvedValue(records);

      const result = await service.getVetVisits(dogId, userId);

      expect(result).toEqual(records);
      expect(vetVisitRepo.find).toHaveBeenCalledWith({
        where: { dogId },
        order: { date: 'DESC' },
      });
    });

    it('should throw ForbiddenException if dog not owned', async () => {
      dogRepo.findOne.mockResolvedValue(null);

      await expect(
        service.getVetVisits(dogId, 'other-user'),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('createVetVisit', () => {
    it('should create a vet visit', async () => {
      const dto = { dogId, date: '2024-01-15', reason: 'Annual checkup' };
      const record = { id: 'vv-1', ...dto } as unknown as VetVisit;
      dogRepo.findOne.mockResolvedValue(mockDog);
      vetVisitRepo.create.mockReturnValue(record);
      vetVisitRepo.save.mockResolvedValue(record);

      const result = await service.createVetVisit(userId, dto);

      expect(result).toEqual(record);
    });
  });

  describe('deleteVetVisit', () => {
    it('should delete the vet visit', async () => {
      const record = {
        id: 'vv-1',
        dogId,
        dog: { userId } as Dog,
      } as VetVisit;
      vetVisitRepo.findOne.mockResolvedValue(record);
      vetVisitRepo.remove.mockResolvedValue(record);

      await service.deleteVetVisit('vv-1', userId);

      expect(vetVisitRepo.remove).toHaveBeenCalledWith(record);
    });

    it('should throw NotFoundException if record not found', async () => {
      vetVisitRepo.findOne.mockResolvedValue(null);

      await expect(
        service.deleteVetVisit('vv-1', userId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if not owned by user', async () => {
      const record = {
        id: 'vv-1',
        dogId,
        dog: { userId: 'other-user' } as Dog,
      } as VetVisit;
      vetVisitRepo.findOne.mockResolvedValue(record);

      await expect(
        service.deleteVetVisit('vv-1', userId),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  // --- Medications ---
  describe('getMedications', () => {
    it('should return medications for an owned dog', async () => {
      const records = [{ id: 'm-1', dogId, name: 'Heartgard' }] as Medication[];
      dogRepo.findOne.mockResolvedValue(mockDog);
      medicationRepo.find.mockResolvedValue(records);

      const result = await service.getMedications(dogId, userId);

      expect(result).toEqual(records);
      expect(medicationRepo.find).toHaveBeenCalledWith({
        where: { dogId },
        order: { startDate: 'DESC' },
      });
    });

    it('should throw ForbiddenException if dog not owned', async () => {
      dogRepo.findOne.mockResolvedValue(null);

      await expect(
        service.getMedications(dogId, 'other-user'),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('createMedication', () => {
    it('should create a medication', async () => {
      const dto = { dogId, name: 'Heartgard', startDate: '2024-01-15' };
      const record = { id: 'm-1', ...dto } as unknown as Medication;
      dogRepo.findOne.mockResolvedValue(mockDog);
      medicationRepo.create.mockReturnValue(record);
      medicationRepo.save.mockResolvedValue(record);

      const result = await service.createMedication(userId, dto);

      expect(result).toEqual(record);
    });
  });

  describe('deleteMedication', () => {
    it('should delete the medication', async () => {
      const record = {
        id: 'm-1',
        dogId,
        dog: { userId } as Dog,
      } as Medication;
      medicationRepo.findOne.mockResolvedValue(record);
      medicationRepo.remove.mockResolvedValue(record);

      await service.deleteMedication('m-1', userId);

      expect(medicationRepo.remove).toHaveBeenCalledWith(record);
    });

    it('should throw NotFoundException if record not found', async () => {
      medicationRepo.findOne.mockResolvedValue(null);

      await expect(
        service.deleteMedication('m-1', userId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if not owned by user', async () => {
      const record = {
        id: 'm-1',
        dogId,
        dog: { userId: 'other-user' } as Dog,
      } as Medication;
      medicationRepo.findOne.mockResolvedValue(record);

      await expect(
        service.deleteMedication('m-1', userId),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
