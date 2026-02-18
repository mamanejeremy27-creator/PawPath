import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn, Unique,
} from 'typeorm';
import { Dog } from './dog.entity';

@Entity('earned_badges')
@Unique(['dogId', 'badgeId'])
export class EarnedBadge {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  dogId: string;

  @ManyToOne(() => Dog, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dogId' })
  dog: Dog;

  @Column()
  badgeId: string;

  @CreateDateColumn()
  earnedAt: Date;
}
