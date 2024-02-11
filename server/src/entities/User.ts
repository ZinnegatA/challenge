import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
  AfterLoad,
} from 'typeorm';
import { Task } from './Task';
import { Solution } from './Solution';
import { Participation } from './Participation';

@Entity()
export class User {
  totalPoints: number;

  @PrimaryGeneratedColumn({ type: 'int' })
  id: string;

  @Column({
    name: 'first_name',
  })
  firstName: string;

  @Column({
    name: 'last_name',
  })
  lastName: string;

  @Column({
    nullable: true,
  })
  photo: string;

  @Column({
    name: 'telescope_link',
  })
  telescopeLink: string;

  @Column({
    name: 'codewars_username',
  })
  codewarsUsername: string;

  @OneToMany(() => Participation, (participation) => participation.user)
  participations: Participation[];

  @ManyToMany(() => Task, (task) => task.users)
  @JoinTable()
  tasks: Task[];

  @OneToMany(() => Solution, (solution) => solution.user)
  @JoinTable()
  solutions: Solution[];

  @AfterLoad()
  setTotalPoints(): void {
    if (this.participations) {
      this.totalPoints = this.participations.reduce((points, participation) => {
        return points + participation.totalPoints;
      }, 0);
    }
  }
}
