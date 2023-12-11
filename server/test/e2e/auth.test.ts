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
  const app = config.test.appUrl;

  it('/api/v1/register should return 200', async () => {
    const userCredentials = {
      firstName: 'firstName',
      lastName: 'lastName',
      telescopeLink: 'https://telescope.epam.com/who/',
      codewarsUsername: 'Sa1Rox',
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
      telescopeLink: 'something',
      codewarsUsername: 'Sa1Rox',
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

describe('POST /api/v1/refresh', () => {
  const app = config.test.appUrl;

  it('/api/v1/register should return 200', async () => {
    const adminCredentials = {
      username: process.env.ADMIN_USERNAME,
      password: process.env.ADMIN_PASSWORD,
    };

    const response = await request(app)
      .post('/api/v1/login')
      .send(adminCredentials)
      .expect(200);

    const token = response.body.token;
    const cookies = response.headers['set-cookie'][0];

    const refreshTokenResponse = await request(app)
      .post('/api/v1/refresh')
      .set('Authorization', `Bearer ${token}`)
      .set('Cookie', cookies)
      .expect(200);

    expect(refreshTokenResponse.body).toHaveProperty(
      'message',
      'The token was successfully updated',
    );
  });

  it('/api/v1/register should return 401 Unauthorized if request without login', async () => {
    const refreshTokenResponse = await request(app)
      .post('/api/v1/refresh')
      .expect(401);

    expect(refreshTokenResponse.body).toHaveProperty(
      'message',
      'Authorization failed',
    );
  });

  it('/api/v1/register should return 401 Unauthorized if request with empty cookie', async () => {
    const adminCredentials = {
      username: process.env.ADMIN_USERNAME,
      password: process.env.ADMIN_PASSWORD,
    };

    const response = await request(app)
      .post('/api/v1/login')
      .send(adminCredentials)
      .expect(200);

    const token = response.body.token;

    const refreshTokenResponse = await request(app)
      .post('/api/v1/refresh')
      .set('Authorization', `Bearer ${token}`)
      .expect(401);

    expect(refreshTokenResponse.body).toHaveProperty(
      'message',
      'Access Denied. No refresh token provided.',
    );
  });
});
