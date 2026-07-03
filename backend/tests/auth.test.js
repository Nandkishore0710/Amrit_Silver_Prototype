import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';

// Mock modules before import
jest.mock('../utils/logger.js', () => ({
  logger: { info: jest.fn(), error: jest.fn(), warn: jest.fn(), debug: jest.fn() }
}));
jest.mock('../config/redis.js', () => ({
  connectRedis: jest.fn().mockResolvedValue(null),
  getRedis: jest.fn().mockReturnValue(null),
  cacheGet: jest.fn().mockResolvedValue(null),
  cacheSet: jest.fn().mockResolvedValue(null),
  cacheDel: jest.fn().mockResolvedValue(null)
}));
jest.mock('../workers/emailWorker.js', () => ({
  initEmailQueue: jest.fn(),
  getQueue: jest.fn().mockReturnValue(null)
}));
jest.mock('../services/emailService.js', () => ({
  sendWelcomeEmail: jest.fn().mockResolvedValue({}),
  sendEmailVerification: jest.fn().mockResolvedValue({}),
  sendOrderConfirmation: jest.fn().mockResolvedValue({})
}));

let app;
const TEST_MONGO_URI = process.env.TEST_MONGO_URI || 'mongodb://localhost:27017/silverkaari_test';

beforeAll(async () => {
  await mongoose.connect(TEST_MONGO_URI);
  // Dynamically import after mocks are set
  const serverModule = await import('../server.js');
  app = serverModule.default || express();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

describe('Auth Endpoints', () => {
  const testUser = {
    name: 'Test User',
    email: `test_${Date.now()}@example.com`,
    password: 'Test@1234'
  };
  let authToken;

  test('POST /api/auth/register — creates new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser)
      .expect(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(testUser.email);
    authToken = res.body.token;
  });

  test('POST /api/auth/register — rejects duplicate email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser)
      .expect(409);
    expect(res.body.success).toBe(false);
  });

  test('POST /api/auth/register — rejects weak password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...testUser, email: 'other@test.com', password: 'weak' })
      .expect(400);
    expect(res.body.success).toBe(false);
  });

  test('POST /api/auth/login — returns token with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password })
      .expect(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    authToken = res.body.token;
  });

  test('POST /api/auth/login — rejects wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: 'WrongPass123' })
      .expect(401);
    expect(res.body.success).toBe(false);
  });

  test('GET /api/auth/me — returns user profile', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe(testUser.email);
  });

  test('GET /api/auth/me — rejects without token', async () => {
    await request(app).get('/api/auth/me').expect(401);
  });

  test('GET /api/health — returns OK', async () => {
    const res = await request(app).get('/api/health').expect(200);
    expect(res.body.status).toBe('OK');
  });
});
