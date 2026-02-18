import {
  Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn,
  ManyToOne, JoinColumn, Unique,
} from 'typeorm';
import { Dog } from './dog.entity';

@Entity('skill_freshness')
@Unique(['dogId', 'exerciseId'])
export class SkillFreshness {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  dogId: string;

  @ManyToOne(() => Dog, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dogId' })
  dog: Dog;

  @Column()
  exerciseId: string;

  @Column({ type: 'timestamp' })
  lastCompleted: Date;

  @Column({ default: 3 })
  interval: number;

  @Column({ default: 0 })
  completions: number;

  @UpdateDateColumn()
  updatedAt: Date;
}
