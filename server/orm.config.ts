import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./src/entities/User";
import { Task } from "./src/entities/Task";
import { Run } from "./src/entities/Run";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "challenge",
  synchronize: true,
  logging: false,
  entities: [User, Task, Run],
  migrations: [`${__dirname}/migrations/**/*{.js,.ts}`],
  subscribers: [`${__dirname}/subscribers/**/*{.js,.ts}`],
});
