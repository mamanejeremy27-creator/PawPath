import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { LostDogReport } from '../../entities/lost-dog-report.entity';
import { Sighting } from '../../entities/sighting.entity';
import type {
  CreateLostDogReportDto,
  UpdateLostDogReportDto,
  CreateSightingDto,
} from './dto';

@Injectable()
export class LostDogsService {
  constructor(
    @InjectRepository(LostDogReport) private reportRepo: Repository<LostDogReport>,
    @InjectRepository(Sighting) private sightingRepo: Repository<Sighting>,
  ) {}

  async getUserReports(userId: string) {
    return this.reportRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async createReport(userId: string, dto: CreateLostDogReportDto) {
    const shareToken = randomBytes(16).toString('hex');
    const report = this.reportRepo.create({ ...dto, userId, shareToken });
    return this.reportRepo.save(report);
  }

  async updateReport(id: string, userId: string, dto: UpdateLostDogReportDto) {
    const report = await this.reportRepo.findOne({ where: { id, userId } });
    if (!report) throw new NotFoundException('Report not found');
    Object.assign(report, dto);
    return this.reportRepo.save(report);
  }

  async addSighting(reportId: string, userId: string | undefined, dto: CreateSightingDto) {
    const report = await this.reportRepo.findOne({ where: { id: reportId } });
    if (!report) throw new NotFoundException('Report not found');
    const sighting = this.sightingRepo.create({ ...dto, reportId, userId });
    return this.sightingRepo.save(sighting);
  }

  async getPublicReport(shareToken: string) {
    const report = await this.reportRepo.findOne({ where: { shareToken } });
    if (!report) throw new NotFoundException('Report not found');
    const sightings = await this.sightingRepo.find({
      where: { reportId: report.id },
      order: { createdAt: 'DESC' },
    });
    return { ...report, sightings };
  }
}
