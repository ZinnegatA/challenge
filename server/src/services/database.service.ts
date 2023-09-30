import { AppDataSource } from '../../orm.config';

export async function initializeDatabase(): Promise<void> {
  try {
    await AppDataSource.initialize();
    console.log('Database connected');
  } catch (err) {
    throw new Error(err);
  }
}
