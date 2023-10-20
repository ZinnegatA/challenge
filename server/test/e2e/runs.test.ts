import request from 'supertest';
import { app, server } from '../../src/app';
import {
  closeDatabase,
  initializeDatabase,
} from '../../src/services/database.service';
import { AppDataSource } from '../../orm.config';

let accessToken: string;

beforeAll(async () => {
  await initializeDatabase();

  const response = await request(app).post('/api/v1/login').send({
    username: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD,
  });

  accessToken = response.body.token;
});

afterAll(async () => {
  await AppDataSource.query('TRUNCATE TABLE run CASCADE');
  await AppDataSource.query('ALTER SEQUENCE run_id_seq RESTART');
  await closeDatabase();
  server.close();
});

describe('POST /api/v1/runs', () => {
  it('/api/v1/runs should create new run and return 201', async () => {
    const newRun = {
      runStartDate: '2000-10-10',
      runEndDate: '2001-10-10',
    };

    const response = await request(app)
      .post('/api/v1/runs')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(newRun)
      .expect(201);

    expect(response.body).toHaveProperty(
      'message',
      'New run successfully created',
    );
  });
});

describe('PUT /api/v1/runs/:id', () => {
  it('/api/v1/runs/:id should return 404 if the run to update is not found', async () => {
    const runToUpdate = {
      newRunEndDate: '2002-10-10',
    };

    const response = await request(app)
      .put('/api/v1/runs/0')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(runToUpdate)
      .expect(404);

    expect(response.body).toHaveProperty('message', 'Run not found');
  });

  it('/api/v1/runs/:id should update the end date of an existing run and return 200', async () => {
    const runToUpdate = {
      newRunEndDate: '2002-10-10',
    };

    const response = await request(app)
      .put('/api/v1/runs/1')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(runToUpdate)
      .expect(200);

    expect(response.body).toHaveProperty(
      'message',
      'Run end date successfully updated',
    );
  });
});

describe('GET /api/v1/runs', () => {
  it('/api/v1/runs should get all runs and return 200', async () => {
    const response = await request(app).get('/api/v1/runs').expect(200);

    expect(response.body.runs).toBeDefined();
  });
});

describe('GET /api/v1/runs/:id', () => {
  it('/api/v1/runs/:id should get details of a specific run and return 200', async () => {
    const response = await request(app).get('/api/v1/runs/1').expect(200);

    expect(response.body.run).toBeDefined();
  });

  it('/api/v1/runs/:id should return 404 if the run is not found', async () => {
    const response = await request(app).get('/api/v1/runs/0').expect(404);

    expect(response.body).toHaveProperty('message', 'Run not found');
  });
});

describe('DELETE /api/v1/runs/:id', () => {
  it('/api/v1/runs/:id should return 404 if the run to delete is not found', async () => {
    const response = await request(app)
      .delete('/api/v1/runs/0')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404);

    expect(response.body).toHaveProperty('message', 'Run not found');
  });

  it('/api/v1/runs/:id should delete a run and return 204', async () => {
    await request(app)
      .delete('/api/v1/runs/1')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(204);
  });
});
