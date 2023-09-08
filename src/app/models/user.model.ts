import {Task} from "./task.model";

export interface User {
  name: string;
  nickname: string;
  tasks: Task[];
  runsPoints: number[];
  prevPoints?: number;
  total: number;
  place?: number;
}

