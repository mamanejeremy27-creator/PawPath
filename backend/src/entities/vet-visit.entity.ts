import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { Dog } from './dog.entity';

@Entity('vet_visits')
export class VetVisit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  dogId: string;

  @ManyToOne(() => Dog, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dogId' })
  dog: Dog;

  @Column({ type: 'date' })
  date: string;

  @Column()
  reason: string;

  @Column({ nullable: true })
  vet: string;

  @Column({ nullable: true })
  notes: string;

  @Column({ type: 'float', nullable: true })
  cost: number;

  @CreateDateColumn()
  createdAt: Date;
}
