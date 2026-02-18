import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaderboardEntry } from '../../entities/leaderboard-entry.entity';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectRepository(LeaderboardEntry)
    private leaderboardRepo: Repository<LeaderboardEntry>,
  ) {}

  async getWeekly() {
    return this.leaderboardRepo.find({
      order: { weeklyXp: 'DESC' },
      take: 50,
    });
  }

  async getAllTime() {
    return this.leaderboardRepo.find({
      order: { totalXp: 'DESC' },
      take: 50,
    });
  }

  async getByBreed(breed: string) {
    return this.leaderboardRepo.find({
      where: { breed },
      order: { totalXp: 'DESC' },
    });
  }
}
