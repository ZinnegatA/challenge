import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Task } from './Task';

@Entity()
export class Run {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  run_start_date: Date;

  @Column()
  run_end_date: Date;

  @OneToMany(() => Task, (task) => task.run)
  tasks: Task[];
}
