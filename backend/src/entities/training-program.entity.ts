import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('training_programs')
export class TrainingProgram {
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
  gradient: string;

  @Column({ default: 0 })
  unlockLevel: number;

  @Column()
  difficulty: string;

  @Column()
  duration: string;

  @Column('jsonb')
  levels: {
    id: string;
    name: string;
    xpReward: number;
    description: string;
    exercises: {
      id: string;
      name: string;
      duration: number;
      difficulty: number;
      lifeStages: string[];
      description: string;
      steps: string[];
      tips: string;
      gear: string[];
    }[];
  }[];
}
