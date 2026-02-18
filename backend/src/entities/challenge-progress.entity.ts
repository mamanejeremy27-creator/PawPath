import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { Dog } from './dog.entity';

@Entity('challenge_progress')
export class ChallengeProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  dogId: string;

  @ManyToOne(() => Dog, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dogId' })
  dog: Dog;

  @Column()
  challengeId: string;

  @Column({ type: 'int' })
  weekNumber: number;

  @Column({ type: 'jsonb', default: '[]' })
  completedDays: number[];

  @Column({ default: false })
  fullComplete: boolean;

  @Column({ nullable: true })
  badgeEarned: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
