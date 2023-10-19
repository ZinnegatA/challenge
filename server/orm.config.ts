import 'reflect-metadata';
import path from 'path';
import { DataSource } from 'typeorm';
import { User } from './src/entities/User';
import { Task } from './src/entities/Task';
import { Run } from './src/entities/Run';
import { Admin } from './src/entities/Admin';
import dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [User, Task, Run, Admin],
  migrations: [path.join(__dirname, '/src/migrations/**/*{.js,.ts}')],
  subscribers: [path.join(__dirname, '/src/subscribers/**/*{.js,.ts}')],
});
