import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { Dog } from './dog.entity';

@Entity('completed_exercises')
export class CompletedExercise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  dogId: string;

  @ManyToOne(() => Dog, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dogId' })
  dog: Dog;

  @Column()
  exerciseId: string;

  @Column()
  levelId: string;

  @Column()
  programId: string;

  @Column({ default: 0 })
  xpEarned: number;

  @Column({ default: false })
  isReview: boolean;

  @CreateDateColumn()
  completedAt: Date;
}
