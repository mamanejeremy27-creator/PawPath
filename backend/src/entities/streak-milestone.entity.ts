import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('streak_milestones')
export class StreakMilestone {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  days: number;

  @Column()
  reward: string;

  @Column()
  rewardId: string;

  @Column()
  name: string;

  @Column()
  emoji: string;

  @Column({ default: 0 })
  xpBonus: number;

  @Column({ default: false })
  freezeReward: boolean;
}
