import request from 'supertest';
import { config } from '../../src/config/config';


describe('POST /api/v1/login', () => {
  const app = config.test.appUrl;

  it('/api/v1/login should return 200 and token', async () => {
    const adminCredentials = {
      username: process.env.ADMIN_USERNAME,
      password: process.env.ADMIN_PASSWORD,
    };

    const response = await request(app)
      .post('/api/v1/login')
      .send(adminCredentials)
      .expect(200);

    expect(response.body).toHaveProperty('message', 'Authentication completed');
    expect(response.body.token).toBeDefined();
  });

  it('/api/v1/login should return 401 for invalid username', async () => {
    const incorrectAdminCredentials = {
      username: 'nonexistentUser',
      password: 'testPassword',
    };

    const response = await request(app)
      .post('/api/v1/login')
      .send(incorrectAdminCredentials)
      .expect(401);

    expect(response.body).toHaveProperty(
      'message',
      `User ${incorrectAdminCredentials.username} not found`,
    );
  });

  it('/api/v1/login should return 401 for incorrect password', async () => {
    const incorrectAdminPassword = {
      username: process.env.ADMIN_USERNAME,
      password: 'testPassword',
    };

    const response = await request(app)
      .post('/api/v1/login')
      .send(incorrectAdminPassword)
      .expect(401);

    expect(response.body).toHaveProperty('message', 'Incorrect password');
  });
});

describe('POST /api/v1/register', () => {
  beforeAll(async () => {
    await initializeDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
    server.close();
  });

  it('/api/v1/register should return 200', async () => {
    const userCredentials = {
      firstName: 'firstName',
      lastName: 'lastName',
      telescope_link: 'https://telescope.epam.com/who/',
      codewars_username: 'Sa1Rox',
      photo: null,
    };

    const response = await request(app)
      .post('/api/v1/register')
      .send(userCredentials)
      .expect(200);

    expect(response.body).toHaveProperty(
      'message',
      'The user has been successfully created',
    );
  });

  it('/api/v1/register should return 401 with error in telescope_link field', async () => {
    const userCredentials = {
      firstName: 'firstName',
      lastName: 'lastName',
      telescope_link: 'something',
      codewars_username: 'Sa1Rox',
      photo: null,
    };

    const response = await request(app)
      .post('/api/v1/register')
      .send(userCredentials)
      .expect(401);

    expect(response.body).toHaveProperty(
      'message',
      'Telescope link should have URL Format',
    );
  });
});
