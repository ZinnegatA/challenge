import { AppDataSource } from '../../orm.config';

export async function initializeDatabase(): Promise<void> {
  await AppDataSource.initialize();
  console.log('Database connected');
}

export async function closeDatabase(): Promise<void> {
  await AppDataSource.destroy();
  console.log('Database disconnected');
}
