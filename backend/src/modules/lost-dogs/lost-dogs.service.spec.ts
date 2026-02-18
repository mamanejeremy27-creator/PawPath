import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { LostDogsService } from './lost-dogs.service';
import { LostDogReport } from '../../entities/lost-dog-report.entity';
import { Sighting } from '../../entities/sighting.entity';

// Mock crypto.randomBytes to return predictable values
jest.mock('crypto', () => ({
  randomBytes: jest.fn(() => Buffer.from('a'.repeat(16))),
}));

describe('LostDogsService', () => {
  let service: LostDogsService;
  let reportRepo: jest.Mocked<Partial<Repository<LostDogReport>>>;
  let sightingRepo: jest.Mocked<Partial<Repository<Sighting>>>;

  const userId = 'user-1';
  const reportId = 'report-1';
  const shareToken = '61'.repeat(16); // hex of 'a' repeated

  const mockReport: LostDogReport = {
    id: reportId,
    userId,
    user: undefined,
    dogName: 'Rex',
    breed: 'German Shepherd',
    description: 'Brown and black',
    lastSeenLocation: { lat: 32.0, lng: 34.0, address: 'Tel Aviv' },
    lastSeenDate: '2024-01-15',
    photo: null,
    status: 'lost',
    shareToken,
    contactInfo: '050-1234567',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    reportRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };
    sightingRepo = {
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LostDogsService,
        { provide: getRepositoryToken(LostDogReport), useValue: reportRepo },
        { provide: getRepositoryToken(Sighting), useValue: sightingRepo },
      ],
    }).compile();

    service = module.get<LostDogsService>(LostDogsService);
  });

  describe('getUserReports', () => {
    it('should return reports for the user', async () => {
      const reports = [mockReport];
      reportRepo.find.mockResolvedValue(reports);

      const result = await service.getUserReports(userId);

      expect(result).toEqual(reports);
      expect(reportRepo.find).toHaveBeenCalledWith({
        where: { userId },
        order: { createdAt: 'DESC' },
      });
    });

    it('should return empty array when user has no reports', async () => {
      reportRepo.find.mockResolvedValue([]);

      const result = await service.getUserReports(userId);

      expect(result).toEqual([]);
    });
  });

  describe('createReport', () => {
    it('should create a report with generated shareToken', async () => {
      const dto = {
        dogName: 'Rex',
        breed: 'German Shepherd',
        description: 'Brown and black',
      };
      reportRepo.create.mockReturnValue(mockReport);
      reportRepo.save.mockResolvedValue(mockReport);

      const result = await service.createReport(userId, dto);

      expect(result).toEqual(mockReport);
      expect(reportRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          ...dto,
          userId,
          shareToken: expect.any(String),
        }),
      );
      expect(reportRepo.save).toHaveBeenCalledWith(mockReport);
    });
  });

  describe('updateReport', () => {
    it('should update and return the report', async () => {
      const dto = { status: 'found' };
      const updatedReport = { ...mockReport, status: 'found' };
      reportRepo.findOne.mockResolvedValue({ ...mockReport });
      reportRepo.save.mockResolvedValue(updatedReport as LostDogReport);

      const result = await service.updateReport(reportId, userId, dto);

      expect(result).toEqual(updatedReport);
      expect(reportRepo.findOne).toHaveBeenCalledWith({
        where: { id: reportId, userId },
      });
    });

    it('should throw NotFoundException when report not found', async () => {
      reportRepo.findOne.mockResolvedValue(null);

      await expect(
        service.updateReport(reportId, userId, { status: 'found' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when report belongs to different user', async () => {
      reportRepo.findOne.mockResolvedValue(null);

      await expect(
        service.updateReport(reportId, 'other-user', { status: 'found' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('addSighting', () => {
    it('should add a sighting to a report with authenticated user', async () => {
      const dto = {
        location: { lat: 32.1, lng: 34.1 },
        description: 'Saw the dog near the park',
      };
      const sighting = {
        id: 's-1',
        reportId,
        userId,
        ...dto,
      } as unknown as Sighting;
      reportRepo.findOne.mockResolvedValue(mockReport);
      sightingRepo.create.mockReturnValue(sighting);
      sightingRepo.save.mockResolvedValue(sighting);

      const result = await service.addSighting(reportId, userId, dto);

      expect(result).toEqual(sighting);
      expect(sightingRepo.create).toHaveBeenCalledWith({
        ...dto,
        reportId,
        userId,
      });
    });

    it('should add a sighting with undefined userId (anonymous)', async () => {
      const dto = {
        location: { lat: 32.1, lng: 34.1 },
        description: 'Saw the dog',
      };
      const sighting = {
        id: 's-1',
        reportId,
        userId: undefined,
        ...dto,
      } as unknown as Sighting;
      reportRepo.findOne.mockResolvedValue(mockReport);
      sightingRepo.create.mockReturnValue(sighting);
      sightingRepo.save.mockResolvedValue(sighting);

      const result = await service.addSighting(reportId, undefined, dto);

      expect(result).toEqual(sighting);
      expect(sightingRepo.create).toHaveBeenCalledWith({
        ...dto,
        reportId,
        userId: undefined,
      });
    });

    it('should throw NotFoundException when report not found', async () => {
      reportRepo.findOne.mockResolvedValue(null);

      await expect(
        service.addSighting(reportId, userId, { description: 'test' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getPublicReport', () => {
    it('should return report with sightings', async () => {
      const sightings = [
        { id: 's-1', reportId, description: 'Spotted near the park' },
      ] as Sighting[];
      reportRepo.findOne.mockResolvedValue(mockReport);
      sightingRepo.find.mockResolvedValue(sightings);

      const result = await service.getPublicReport(shareToken);

      expect(result).toEqual({ ...mockReport, sightings });
      expect(reportRepo.findOne).toHaveBeenCalledWith({
        where: { shareToken },
      });
      expect(sightingRepo.find).toHaveBeenCalledWith({
        where: { reportId: mockReport.id },
        order: { createdAt: 'DESC' },
      });
    });

    it('should throw NotFoundException when shareToken not found', async () => {
      reportRepo.findOne.mockResolvedValue(null);

      await expect(
        service.getPublicReport('invalid-token'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
