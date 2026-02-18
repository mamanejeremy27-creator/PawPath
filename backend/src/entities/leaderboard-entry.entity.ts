import {
  Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn,
  ManyToOne, JoinColumn, Unique,
} from 'typeorm';
import { Dog } from './dog.entity';

@Entity('leaderboard_entries')
@Unique(['dogId'])
export class LeaderboardEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  dogId: string;

  @ManyToOne(() => Dog, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dogId' })
  dog: Dog;

  @Column()
  dogName: string;

  @Column({ nullable: true })
  breed: string;

  @Column({ default: 0 })
  totalXp: number;

  @Column({ default: 0 })
  weeklyXp: number;

  @Column({ default: 0 })
  currentStreak: number;

  @Column({ type: 'date', nullable: true })
  weekStart: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
