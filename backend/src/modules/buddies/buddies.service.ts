import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BuddyRequest } from '../../entities/buddy-request.entity';

const MAX_BUDDIES = 3;

@Injectable()
export class BuddiesService {
  constructor(
    @InjectRepository(BuddyRequest)
    private buddyRepo: Repository<BuddyRequest>,
  ) {}

  async listBuddies(userId: string) {
    return this.buddyRepo.find({
      where: [
        { fromUserId: userId, status: 'accepted' },
        { toUserId: userId, status: 'accepted' },
      ],
      relations: ['fromUser', 'toUser'],
    });
  }

  async sendRequest(fromUserId: string, toUserId: string) {
    if (fromUserId === toUserId) {
      throw new BadRequestException('Cannot send buddy request to yourself');
    }

    const acceptedCount = await this.buddyRepo.count({
      where: [
        { fromUserId, status: 'accepted' },
        { toUserId: fromUserId, status: 'accepted' },
      ],
    });
    if (acceptedCount >= MAX_BUDDIES) {
      throw new BadRequestException(`Maximum ${MAX_BUDDIES} buddies allowed`);
    }

    const existing = await this.buddyRepo.findOne({
      where: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });
    if (existing) {
      throw new BadRequestException('Buddy request already exists');
    }

    const request = this.buddyRepo.create({ fromUserId, toUserId });
    return this.buddyRepo.save(request);
  }

  async accept(id: string, userId: string) {
    const request = await this.buddyRepo.findOne({ where: { id, toUserId: userId, status: 'pending' } });
    if (!request) throw new NotFoundException('Buddy request not found');
    request.status = 'accepted';
    return this.buddyRepo.save(request);
  }

  async reject(id: string, userId: string) {
    const request = await this.buddyRepo.findOne({ where: { id, toUserId: userId, status: 'pending' } });
    if (!request) throw new NotFoundException('Buddy request not found');
    request.status = 'rejected';
    return this.buddyRepo.save(request);
  }

  async remove(id: string, userId: string) {
    const request = await this.buddyRepo.findOne({
      where: [
        { id, fromUserId: userId },
        { id, toUserId: userId },
      ],
    });
    if (!request) throw new NotFoundException('Buddy not found');
    await this.buddyRepo.remove(request);
  }
}
