import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { Dog } from './dog.entity';

@Entity('streak_history')
export class StreakHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  dogId: string;

  @ManyToOne(() => Dog, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dogId' })
  dog: Dog;

  @Column()
  streakLength: number;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date' })
  endDate: string;

  @Column({ default: 'completed' })
  reason: string;

  @CreateDateColumn()
  createdAt: Date;
}
