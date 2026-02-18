import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { LostDogReport } from './lost-dog-report.entity';

@Entity('sightings')
export class Sighting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  reportId: string;

  @ManyToOne(() => LostDogReport, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reportId' })
  report: LostDogReport;

  @Column({ nullable: true })
  userId: string;

  @Column({ type: 'jsonb', nullable: true })
  location: { lat: number; lng: number; address?: string };

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  photo: string;

  @CreateDateColumn()
  createdAt: Date;
}
