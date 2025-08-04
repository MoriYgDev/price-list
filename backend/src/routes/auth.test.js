import request from 'supertest';
import express from 'express';
import authRouter from './auth.js';

const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);

describe('Auth Routes', () => {
  it('should login a user with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'admin',
        password: 'password123',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not login a user with incorrect credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'admin',
        password: 'wrongpassword',
      });
    expect(res.statusCode).toEqual(401);
  });

  it('should not login a user with missing credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'admin',
      });
    expect(res.statusCode).toEqual(400);
  });
});
