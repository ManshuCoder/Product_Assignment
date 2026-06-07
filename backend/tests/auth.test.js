require('./setup');
const request = require('supertest');
const app = require('../src/app');

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
  });
});
