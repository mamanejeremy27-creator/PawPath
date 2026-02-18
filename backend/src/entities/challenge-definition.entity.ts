import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('challenge_definitions')
export class ChallengeDefinition {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  emoji: string;

  @Column()
  description: string;

  @Column()
  color: string;

  @Column()
  bonusXP: number;

  @Column()
  badgeId: string;

  @Column('jsonb')
  days: { day: number; exerciseId: string; task: string }[];
}
