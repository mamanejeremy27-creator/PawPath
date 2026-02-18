import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn, Unique,
} from 'typeorm';
import { Dog } from './dog.entity';

@Entity('dog_progress')
@Unique(['dogId'])
export class DogProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  dogId: string;

  @ManyToOne(() => Dog, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dogId' })
  dog: Dog;

  @Column({ default: 0 })
  totalXP: number;

  @Column({ default: 0 })
  currentStreak: number;

  @Column({ default: 0 })
  bestStreak: number;

  @Column({ type: 'date', nullable: true })
  lastTrainDate: string;

  @Column({ default: 0 })
  totalSessions: number;

  @Column({ default: 0 })
  totalReviews: number;

  @Column({ type: 'jsonb', default: '[]' })
  completedExercises: string[];

  @Column({ type: 'jsonb', default: '[]' })
  completedLevels: string[];

  @Column({ type: 'jsonb', default: '{}' })
  streakData: Record<string, any>;

  @Column({ type: 'jsonb', default: '{}' })
  difficultyTracking: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
