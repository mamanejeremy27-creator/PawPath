import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from '../../entities/feedback.entity';
import type { CreateFeedbackDto } from './dto';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private feedbackRepo: Repository<Feedback>,
  ) {}

  async create(userId: string, dto: CreateFeedbackDto): Promise<Feedback> {
    const feedback = this.feedbackRepo.create({ ...dto, userId });
    return this.feedbackRepo.save(feedback);
  }

  async findAll(): Promise<Feedback[]> {
    return this.feedbackRepo.find({
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });
  }
}
