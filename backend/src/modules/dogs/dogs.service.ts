import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dog } from '../../entities/dog.entity';
import type { CreateDogDto, UpdateDogDto } from './dto';

@Injectable()
export class DogsService {
  constructor(
    @InjectRepository(Dog)
    private dogRepository: Repository<Dog>,
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

  async create(userId: string, createDogDto: CreateDogDto): Promise<Dog> {
    const dog = this.dogRepository.create({ ...createDogDto, userId });
    return this.dogRepository.save(dog);
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
