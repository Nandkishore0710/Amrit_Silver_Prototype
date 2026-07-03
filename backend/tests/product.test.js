import request from 'supertest';
import mongoose from 'mongoose';

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
jest.mock('../workers/emailWorker.js', () => ({ initEmailQueue: jest.fn(), getQueue: jest.fn().mockReturnValue(null) }));
jest.mock('../services/emailService.js', () => ({
  sendWelcomeEmail: jest.fn(), sendEmailVerification: jest.fn(), sendOrderConfirmation: jest.fn()
}));

let app, adminToken;

const TEST_MONGO_URI = process.env.TEST_MONGO_URI || 'mongodb://localhost:27017/silverkaari_test';

beforeAll(async () => {
  await mongoose.connect(TEST_MONGO_URI);
  const serverModule = await import('../server.js');
  app = serverModule.default;

  // Create admin and login
  const User = (await import('../models/User.js')).default;
  await User.create({
    name: 'Admin', email: 'admin_test@test.com', password: 'Admin@1234',
    role: 'admin', isEmailVerified: true
  });
  const res = await request(app).post('/api/auth/login').send({ email: 'admin_test@test.com', password: 'Admin@1234' });
  adminToken = res.body.token;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

describe('Product Endpoints', () => {
  let productSlug;

  test('GET /api/products — returns product list', async () => {
    const res = await request(app).get('/api/products').expect(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('GET /api/products/featured — returns featured products', async () => {
    const res = await request(app).get('/api/products/featured').expect(200);
    expect(res.body.success).toBe(true);
  });

  test('GET /api/products/best-sellers — returns best sellers', async () => {
    const res = await request(app).get('/api/products/best-sellers').expect(200);
    expect(res.body.success).toBe(true);
  });

  test('POST /api/products — admin can create product', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Test Silver Ring',
        slug: 'test-silver-ring',
        description: 'A beautiful test silver ring crafted by artisans.',
        category: 'Rings',
        basePrice: 2500,
        variants: [{ metal: '925 Silver', purity: '92.5', price: 2500, stock: 10, sku: 'TSR-001' }]
      })
      .expect(201);
    expect(res.body.success).toBe(true);
    productSlug = res.body.data.slug;
  });

  test('GET /api/products/:slug — returns product by slug', async () => {
    if (!productSlug) return;
    const res = await request(app).get(`/api/products/${productSlug}`).expect(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.slug).toBe(productSlug);
  });

  test('GET /api/products — filter by category', async () => {
    const res = await request(app).get('/api/products?category=Rings').expect(200);
    expect(res.body.success).toBe(true);
    res.body.data.forEach(p => expect(p.category).toBe('Rings'));
  });

  test('GET /api/products/:slug — 404 for unknown slug', async () => {
    const res = await request(app).get('/api/products/nonexistent-product-xyz').expect(404);
    expect(res.body.success).toBe(false);
  });

  test('POST /api/products — unauthorized without token', async () => {
    await request(app).post('/api/products').send({ name: 'Hack' }).expect(401);
  });
});
