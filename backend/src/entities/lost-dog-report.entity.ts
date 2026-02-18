import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('lost_dog_reports')
export class LostDogReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  dogName: string;

  @Column({ nullable: true })
  breed: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'jsonb', nullable: true })
  lastSeenLocation: { lat: number; lng: number; address?: string };

  @Column({ type: 'date', nullable: true })
  lastSeenDate: string;

  @Column({ nullable: true })
  photo: string;

  @Column({ default: 'lost' })
  status: string;

  @Column({ unique: true })
  shareToken: string;

  @Column({ nullable: true })
  contactInfo: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
