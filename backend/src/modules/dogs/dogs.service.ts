import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dog } from '../../entities/dog.entity';
import { EarnedBadge } from '../../entities/earned-badge.entity';
import type { CreateDogDto, UpdateDogDto } from './dto';

@Injectable()
export class DogsService {
  constructor(
    @InjectRepository(Dog)
    private dogRepository: Repository<Dog>,
    @InjectRepository(EarnedBadge)
    private badgeRepo: Repository<EarnedBadge>,
  ) {}

  async findAll(userId: string): Promise<Dog[]> {
    return this.dogRepository.find({
      where: { userId },
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Dog> {
    const dog = await this.dogRepository.findOne({ where: { id, userId } });
    if (!dog) throw new NotFoundException('Dog not found');
    return dog;
  }

  async create(userId: string, createDogDto: CreateDogDto) {
    const dog = this.dogRepository.create({ ...createDogDto, userId });
    const saved = await this.dogRepository.save(dog);
    const newBadges: string[] = [];

    // Award double_trouble badge if user now has 2+ dogs
    const dogCount = await this.dogRepository.count({ where: { userId } });
    if (dogCount >= 2) {
      const existing = await this.badgeRepo.findOne({
        where: { dogId: saved.id, badgeId: 'double_trouble' },
      });
      if (!existing) {
        await this.badgeRepo.save(
          this.badgeRepo.create({ dogId: saved.id, badgeId: 'double_trouble' }),
        );
        newBadges.push('double_trouble');
      }
    }

    return { ...saved, newBadges };
  }

  async update(id: string, userId: string, updateDogDto: UpdateDogDto): Promise<Dog> {
    const dog = await this.findOne(id, userId);
    Object.assign(dog, updateDogDto);
    return this.dogRepository.save(dog);
  }

  async updatePhoto(id: string, userId: string, photoPath: string): Promise<Dog> {
    const dog = await this.findOne(id, userId);
    dog.photo = photoPath;
    return this.dogRepository.save(dog);
  }

  async remove(id: string, userId: string): Promise<void> {
    const dog = await this.findOne(id, userId);
    await this.dogRepository.remove(dog);
  }
}
