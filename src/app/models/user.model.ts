import {Task} from "./task.model";

export interface User {
  name: string;
  nickname: string;
  tasks: Task[];
  prevPoints: number;
  total: number;
  place?: number;
}

