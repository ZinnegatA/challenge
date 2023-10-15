import request from 'supertest';
import { app, server } from '../../src/app';
import {
  closeDatabase,
  initializeDatabase,
} from '../../src/services/database.service';

describe('POST /api/v1/runs', () => {
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
    await closeDatabase();
    server.close();
  });

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

describe('PUT /api/v1/runs', () => {
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
    await closeDatabase();
    server.close();
  });

  it('/api/v1/runs should return 404 if the run to update is not found', async () => {
    const runToUpdate = {
      runStartDate: '1998-10-10',
      newRunEndDate: '2001-10-10',
    };

    const response = await request(app)
      .put('/api/v1/runs')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(runToUpdate)
      .expect(404);

    expect(response.body).toHaveProperty('message', 'Run not found');
  });

  it('/api/v1/runs should update the end date of an existing run and return 200', async () => {
    const runToUpdate = {
      runStartDate: '2000-10-10',
      newRunEndDate: '2002-10-10',
    };

    const response = await request(app)
      .put('/api/v1/runs')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(runToUpdate)
      .expect(200);

    expect(response.body).toHaveProperty(
      'message',
      'Run end date successfully updated',
    );
  });
});

describe('GET /api/v1/runs and GET /api/v1/run', () => {
  beforeAll(async () => {
    await initializeDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
    server.close();
  });

  it('/api/v1/runs should get all runs and return 200', async () => {
    const response = await request(app).get('/api/v1/runs').expect(200);

    expect(response.body.runs).toBeDefined();
  });

  it('/api/v1/run should get details of a specific run and return 200', async () => {
    const runToFind = {
      runStartDate: '2000-10-10',
    };

    const response = await request(app)
      .get('/api/v1/run')
      .send(runToFind)
      .expect(200);

    expect(response.body.run).toBeDefined();
  });
});

describe('DELETE /api/v1/runs', () => {
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
    await closeDatabase();
    server.close();
  });

  it('/api/v1/runs should return 404 if the run to delete is not found', async () => {
    const runToDelete = {
      runStartDate: '1998-10-10',
    };

    const response = await request(app)
      .delete('/api/v1/runs')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(runToDelete)
      .expect(404);

    expect(response.body).toHaveProperty('message', 'Run not found');
  });

  it('/api/v1/runs should delete a run and return 204', async () => {
    const runToDelete = {
      runStartDate: '2000-10-10',
    };

    await request(app)
      .delete('/api/v1/runs')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(runToDelete)
      .expect(204);
  });
});
