require('./setup');
const request = require('supertest');
const app = require('../src/app');

describe('Products API', () => {
  let token;

  const product = {
    productId: 'PROD-001',
    name: 'Wireless Headphones',
    price: 149.99,
    featured: true,
    rating: 4.5,
    company: 'SoundTech',
  };

  beforeEach(async () => {
    const res = await request(app).post('/api/auth/signup').send({
      name: 'Product Tester',
      email: 'products@example.com',
      password: 'password123',
    });
    token = res.body.data.token;
  });

  const authHeader = () => ({ Authorization: `Bearer ${token}` });

  describe('POST /api/products', () => {
    it('should create a product when authenticated', async () => {
      const res = await request(app)
        .post('/api/products')
        .set(authHeader())
        .send(product);

      expect(res.status).toBe(201);
      expect(res.body.data.product.name).toBe(product.name);
    });

    it('should reject unauthenticated requests', async () => {
      const res = await request(app).post('/api/products').send(product);
      expect(res.status).toBe(401);
    });

    it('should reject invalid product data', async () => {
      const res = await request(app)
        .post('/api/products')
        .set(authHeader())
        .send({ ...product, price: -10 });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/products', () => {
    beforeEach(async () => {
      await request(app).post('/api/products').set(authHeader()).send(product);
      await request(app)
        .post('/api/products')
        .set(authHeader())
        .send({ ...product, productId: 'PROD-002', name: 'Smart Watch', price: 299, rating: 3.8 });
    });

    it('should fetch all products', async () => {
      const res = await request(app).get('/api/products').set(authHeader());
      expect(res.status).toBe(200);
      expect(res.body.data.products.length).toBe(2);
      expect(res.body.meta.total).toBe(2);
    });

    it('should search products by name', async () => {
      const res = await request(app)
        .get('/api/products?search=Watch')
        .set(authHeader());

      expect(res.status).toBe(200);
      expect(res.body.data.products.length).toBe(1);
    });

    it('should sort products by price', async () => {
      const res = await request(app)
        .get('/api/products?sort=price_desc')
        .set(authHeader());

      expect(res.status).toBe(200);
      expect(res.body.data.products[0].price).toBe(299);
    });
  });

  describe('GET /api/products/featured', () => {
    it('should return featured products only', async () => {
      await request(app).post('/api/products').set(authHeader()).send(product);
      await request(app)
        .post('/api/products')
        .set(authHeader())
        .send({ ...product, productId: 'PROD-003', featured: false });

      const res = await request(app).get('/api/products/featured').set(authHeader());
      expect(res.status).toBe(200);
      expect(res.body.data.products.length).toBe(1);
      expect(res.body.data.products[0].featured).toBe(true);
    });
  });

  describe('GET /api/products/price/below/:price', () => {
    it('should return products below price', async () => {
      await request(app).post('/api/products').set(authHeader()).send(product);

      const res = await request(app)
        .get('/api/products/price/below/200')
        .set(authHeader());

      expect(res.status).toBe(200);
      expect(res.body.data.products.every((p) => p.price < 200)).toBe(true);
    });
  });

  describe('PUT /api/products/:id', () => {
    it('should update a product', async () => {
      const created = await request(app)
        .post('/api/products')
        .set(authHeader())
        .send(product);

      const res = await request(app)
        .put(`/api/products/${created.body.data.product._id}`)
        .set(authHeader())
        .send({ price: 129.99 });

      expect(res.status).toBe(200);
      expect(res.body.data.product.price).toBe(129.99);
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('should delete a product', async () => {
      const created = await request(app)
        .post('/api/products')
        .set(authHeader())
        .send(product);

      const res = await request(app)
        .delete(`/api/products/${created.body.data.product._id}`)
        .set(authHeader());

      expect(res.status).toBe(200);
    });
  });
});
