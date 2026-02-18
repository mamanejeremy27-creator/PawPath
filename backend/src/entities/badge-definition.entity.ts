import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('badge_definitions')
export class BadgeDefinition {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  emoji: string;

  @Column()
  desc: string;

  @Column()
  category: string;
}
