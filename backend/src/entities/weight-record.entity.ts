import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { Dog } from './dog.entity';

@Entity('weight_records')
export class WeightRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  dogId: string;

  @ManyToOne(() => Dog, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dogId' })
  dog: Dog;

  @Column({ type: 'float' })
  weight: number;

  @Column({ type: 'date' })
  date: string;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;
}
