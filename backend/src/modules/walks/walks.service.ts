import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Walk } from '../../entities/walk.entity';
import { Dog } from '../../entities/dog.entity';
import type { CreateWalkDto } from './dto';

@Injectable()
export class WalksService {
  constructor(
    @InjectRepository(Walk) private walkRepo: Repository<Walk>,
    @InjectRepository(Dog) private dogRepo: Repository<Dog>,
  ) {}

  async findByDog(dogId: string, userId: string): Promise<Walk[]> {
    const dog = await this.dogRepo.findOne({ where: { id: dogId, userId } });
    if (!dog) throw new ForbiddenException('Dog not found or not owned by user');
    return this.walkRepo.find({ where: { dogId }, order: { startTime: 'DESC' } });
  }

  async create(userId: string, dto: CreateWalkDto): Promise<Walk> {
    const dog = await this.dogRepo.findOne({ where: { id: dto.dogId, userId } });
    if (!dog) throw new ForbiddenException('Dog not found or not owned by user');
    const walk = this.walkRepo.create(dto);
    return this.walkRepo.save(walk);
  }

  async remove(id: string, userId: string): Promise<void> {
    const walk = await this.walkRepo.findOne({ where: { id }, relations: ['dog'] });
    if (!walk) throw new NotFoundException('Walk not found');
    if (walk.dog.userId !== userId) throw new ForbiddenException();
    await this.walkRepo.remove(walk);
  }
}
