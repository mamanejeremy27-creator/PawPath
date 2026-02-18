import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { Dog } from './dog.entity';

@Entity('journal_entries')
export class JournalEntry {
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
  exerciseName: string;

  @Column()
  programName: string;

  @Column({ nullable: true })
  programEmoji: string;

  @Column({ type: 'text', nullable: true })
  note: string;

  @Column({ default: 3 })
  rating: number;

  @Column({ default: 'happy' })
  mood: string;

  @Column({ type: 'jsonb', default: '[]' })
  photos: string[];

  @CreateDateColumn()
  createdAt: Date;
}
