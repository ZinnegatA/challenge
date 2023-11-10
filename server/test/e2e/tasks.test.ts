import request from 'supertest';
import { AppDataSource } from '../../orm.config';
import { config } from '../../src/config/config';

let accessToken: string;

describe('Tasks suite', () => {
  const app = config.test.appUrl;

  beforeAll(async () => {
    await AppDataSource.initialize();
    await AppDataSource.query(
      "INSERT INTO run (run_start_date, run_end_date) VALUES ('2020-10-10', '2021-10-10')",
    );

    const response = await request(app).post('/api/v1/login').send({
      username: process.env.ADMIN_USERNAME,
      password: process.env.ADMIN_PASSWORD,
    });

    accessToken = response.body.token;
  });

  afterAll(async () => {
    await AppDataSource.query('TRUNCATE TABLE run CASCADE');
    await AppDataSource.query('ALTER SEQUENCE run_id_seq RESTART');
    await AppDataSource.query('TRUNCATE TABLE task CASCADE');
    await AppDataSource.destroy();
  });

  describe('POST /api/v1/tasks', () => {
    it('should create new task and return 201', async () => {
      const newTask = {
        id: '5277c8a221e209d3f6000b56',
        runId: 1,
      };

      const response = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(newTask)
        .expect(201);

      expect(response.body).toHaveProperty(
        'message',
        `New task with id ${newTask.id} successfully created`,
      );
    });
  });

  describe('GET /api/v1/tasks', () => {
    it('/api/v1/tasks should get all tasks and return 200', async () => {
      const response = await request(app).get('/api/v1/tasks').expect(200);

      expect(response.body.tasks).toBeDefined();
    });
  });

  describe('GET /api/v1/tasks/:id', () => {
    it('/api/v1/tasks/:id should get details of a specific task and return 200', async () => {
      const response = await request(app)
        .get('/api/v1/tasks/5277c8a221e209d3f6000b56')
        .expect(200);

      expect(response.body.task).toBeDefined();
    });

    it('/api/v1/tasks/:id should return 404 if the run is not found', async () => {
      const response = await request(app).get('/api/v1/tasks/0').expect(404);

      expect(response.body).toHaveProperty('message', 'Task not found');
    });
  });

  describe('DELETE /api/v1/tasks/:id', () => {
    it('/api/v1/tasks/:id should return 404 if the task to delete is not found', async () => {
      const response = await request(app)
        .delete('/api/v1/tasks/0')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('message', 'Task not found');
    });

    it('/api/v1/tasks/:id should delete a task and return 204', async () => {
      await request(app)
        .delete('/api/v1/tasks/5277c8a221e209d3f6000b56')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(204);
    });
  });
})
