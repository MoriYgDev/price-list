import request from 'supertest';
import express from 'express';
import productRouter from './products.test.router.js';

const app = express();
app.use(express.json());
app.use('/api/products', productRouter);

describe('Product Routes', () => {
  it('should get all products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should create a new product', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({
        name: 'Test Product',
        partnerName: 'Test Partner',
        registrationDate: '2023-01-01T00:00:00.000Z',
        price: 100,
        profitPercentage: 50,
        description: 'Test Description',
        logoId: 1,
        brandName: 'Test Brand',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
  });
});
