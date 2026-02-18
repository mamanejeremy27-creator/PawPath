import {
  Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn,
  OneToOne, JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_settings')
export class UserSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  userId: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ default: 'en' })
  language: string;

  @Column({ default: 'default' })
  theme: string;

  @Column({ type: 'jsonb', default: '{"enabled":false,"times":["09:00","18:00"]}' })
  reminders: Record<string, any>;

  @Column({ default: false })
  leaderboardOptIn: boolean;

  @Column({ type: 'jsonb', default: '[]' })
  unlockedThemes: string[];

  @Column({ type: 'jsonb', default: '[]' })
  unlockedAccessories: string[];

  @Column({ nullable: true })
  activeAccessory: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
