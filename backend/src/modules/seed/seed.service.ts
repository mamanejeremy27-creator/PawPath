import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  TrainingProgram,
  BadgeDefinition,
  ChallengeDefinition,
  StreakMilestone,
} from '../../entities';
import { PROGRAMS_SEED } from './data/programs.seed';
import { BADGES_SEED } from './data/badges.seed';
import { CHALLENGES_SEED } from './data/challenges.seed';
import { STREAK_MILESTONES_SEED } from './data/streak-milestones.seed';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(TrainingProgram)
    private readonly programRepo: Repository<TrainingProgram>,
    @InjectRepository(BadgeDefinition)
    private readonly badgeRepo: Repository<BadgeDefinition>,
    @InjectRepository(ChallengeDefinition)
    private readonly challengeRepo: Repository<ChallengeDefinition>,
    @InjectRepository(StreakMilestone)
    private readonly milestoneRepo: Repository<StreakMilestone>,
  ) {}

  async onModuleInit() {
    await this.seedPrograms();
    await this.seedBadges();
    await this.seedChallenges();
    await this.seedStreakMilestones();
  }

  private async seedPrograms() {
    const count = await this.programRepo.count();
    if (count > 0) return;

    await this.programRepo.save(PROGRAMS_SEED);
    this.logger.log(`Seeded ${PROGRAMS_SEED.length} training programs`);
  }

  private async seedBadges() {
    const count = await this.badgeRepo.count();
    if (count > 0) return;

    await this.badgeRepo.save(BADGES_SEED);
    this.logger.log(`Seeded ${BADGES_SEED.length} badge definitions`);
  }

  private async seedChallenges() {
    const count = await this.challengeRepo.count();
    if (count > 0) return;

    await this.challengeRepo.save(CHALLENGES_SEED);
    this.logger.log(`Seeded ${CHALLENGES_SEED.length} challenge definitions`);
  }

  private async seedStreakMilestones() {
    const count = await this.milestoneRepo.count();
    if (count > 0) return;

    await this.milestoneRepo.save(STREAK_MILESTONES_SEED);
    this.logger.log(`Seeded ${STREAK_MILESTONES_SEED.length} streak milestones`);
  }
}
