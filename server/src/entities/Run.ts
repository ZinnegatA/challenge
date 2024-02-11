import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Task } from './Task';
import { Participation } from './Participation';

@Entity()
export class Run {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  run_start_date: Date;

  @Column()
  run_end_date: Date;

  @Column({ name: 'leaderboard_updated_date', nullable: true })
  leaderboardUpdatedDate: Date;

  @OneToMany(() => Task, (task) => task.run)
  tasks: Task[];

  @OneToMany(() => Participation, (participation) => participation.run)
  participations: Participation;
}
