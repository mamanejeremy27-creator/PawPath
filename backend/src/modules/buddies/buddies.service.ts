import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { BuddyRequest } from '../../entities/buddy-request.entity';
import { Dog } from '../../entities/dog.entity';
import { DogProgress } from '../../entities/dog-progress.entity';
import { LeaderboardEntry } from '../../entities/leaderboard-entry.entity';
import { User } from '../../entities/user.entity';

const MAX_BUDDIES = 3;

@Injectable()
export class BuddiesService {
  constructor(
    @InjectRepository(BuddyRequest)
    private buddyRepo: Repository<BuddyRequest>,
    @InjectRepository(Dog)
    private dogRepo: Repository<Dog>,
    @InjectRepository(DogProgress)
    private dogProgressRepo: Repository<DogProgress>,
    @InjectRepository(LeaderboardEntry)
    private leaderboardRepo: Repository<LeaderboardEntry>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
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

  async findCandidates(userId: string) {
    // 1. Get the current user's first dog + progress
    const myDog = await this.dogRepo.findOne({ where: { userId } });
    let myXP = 0;
    let myStreak = 0;
    let myBreed: string | null = null;

    if (myDog) {
      myBreed = myDog.breed;
      const myProgress = await this.dogProgressRepo.findOne({ where: { dogId: myDog.id } });
      if (myProgress) {
        myXP = myProgress.totalXP;
        myStreak = myProgress.currentStreak;
      }
    }

    // 2. Get all existing buddy relationships and pending requests to exclude
    const existingRequests = await this.buddyRepo.find({
      where: [
        { fromUserId: userId },
        { toUserId: userId },
      ],
    });

    const excludeUserIds = new Set<string>([userId]);
    for (const req of existingRequests) {
      if (req.status === 'accepted' || req.status === 'pending') {
        excludeUserIds.add(req.fromUserId === userId ? req.toUserId : req.fromUserId);
      }
    }

    // 3. Get all leaderboard entries with their dog's user info
    const entries = await this.leaderboardRepo.find({ relations: ['dog'] });

    // 4. Collect unique user IDs for name lookup
    const candidateUserIds = entries
      .map(e => e.dog?.userId)
      .filter((uid): uid is string => !!uid && !excludeUserIds.has(uid));

    if (candidateUserIds.length === 0) return [];

    const users = await this.userRepo.find({ where: { id: In([...new Set(candidateUserIds)]) } });
    const userMap = new Map(users.map(u => [u.id, u.name]));

    // 5. Score each candidate
    const candidates = entries
      .filter(e => e.dog?.userId && !excludeUserIds.has(e.dog.userId))
      .map(e => {
        const theirXP = e.totalXp;
        const theirStreak = e.currentStreak;
        const theirWeeklyXP = e.weeklyXp;
        const theirBreed = e.breed;

        // XP proximity (40pts)
        const xpMax = Math.max(myXP, theirXP, 1);
        const xpScore = 40 * (1 - Math.abs(myXP - theirXP) / xpMax);

        // Streak similarity (25pts)
        const streakMax = Math.max(myStreak, theirStreak, 1);
        const streakScore = 25 * (1 - Math.abs(myStreak - theirStreak) / streakMax);

        // Activity recency (20pts)
        const activityScore = 20 * (theirWeeklyXP > 0 ? 1 : 0.2);

        // Breed match (15pts)
        const breedScore = (myBreed && theirBreed && myBreed.toLowerCase() === theirBreed.toLowerCase()) ? 15 : 0;

        const score = Math.round(xpScore + streakScore + activityScore + breedScore);

        return {
          userId: e.dog.userId,
          dogName: e.dogName,
          breed: e.breed,
          ownerName: userMap.get(e.dog.userId) || '',
          score,
          currentStreak: theirStreak,
          totalXP: theirXP,
          weeklyXP: theirWeeklyXP,
        };
      });

    // 6. Deduplicate by userId (keep highest score), sort desc, top 20
    const bestByUser = new Map<string, typeof candidates[0]>();
    for (const c of candidates) {
      const existing = bestByUser.get(c.userId);
      if (!existing || c.score > existing.score) {
        bestByUser.set(c.userId, c);
      }
    }

    return [...bestByUser.values()]
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);
  }
}
