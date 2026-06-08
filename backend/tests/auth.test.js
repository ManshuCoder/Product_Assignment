require('./setup');
const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');

describe('Auth API', () => {
  const user = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
  };

  describe('POST /api/auth/signup', () => {
    it('should register a new user', async () => {
      const res = await request(app).post('/api/auth/signup').send(user);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(user.email);
      expect(res.body.data.token).toBeDefined();
    });

    it('should reject duplicate email', async () => {
      await request(app).post('/api/auth/signup').send(user);
      const res = await request(app).post('/api/auth/signup').send(user);

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it('should reject invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ ...user, email: 'invalid-email' });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/signup').send(user);
    });

    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: user.email, password: user.password });

      expect(res.status).toBe(200);
      expect(res.body.data.token).toBeDefined();
    });

    it('should reject invalid password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: user.email, password: 'wrongpassword' });

      expect(res.status).toBe(401);
    });

    it('should login and upgrade a legacy plaintext password', async () => {
      const legacyUser = {
        name: 'Legacy User',
        email: 'legacy@example.com',
        password: 'legacyPass123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await User.collection.insertOne(legacyUser);

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: legacyUser.email, password: legacyUser.password });

      expect(res.status).toBe(200);
      expect(res.body.data.token).toBeDefined();

      const stored = await User.findOne({ email: legacyUser.email }).select('+password');
      expect(stored.password).not.toBe(legacyUser.password);
      expect(stored.password).toMatch(/^\$2[aby]\$\d{2}\$/);
    });
  });
});
