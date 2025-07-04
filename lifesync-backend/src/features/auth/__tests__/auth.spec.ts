import request from 'supertest';
import app from '../../../index';  // ensure index exports your express app

describe('Auth Endpoints', () => {
  it('should reject invalid registration payload', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'not-an-email', phone: '123', password: '' });
    
    expect(res.status).toBe(400);
    expect(res.body.errors).toHaveProperty('email');
    expect(res.body.errors).toHaveProperty('phone');
    expect(res.body.errors).toHaveProperty('password');
  });

  it('should register & login a user', async () => {
    const user = {
      email: 'test@example.com',
      phone: '555123456',
      password: 'TestPass1'
    };

    const reg = await request(app)
      .post('/api/auth/register')
      .send(user);
    expect(reg.status).toBe(201);
    expect(reg.body).toHaveProperty('token');
    expect(reg.body.user.email).toBe(user.email);

    const log = await request(app)
      .post('/api/auth/login')
      .send({ identifier: user.email, password: user.password });
    expect(log.status).toBe(200);
    expect(log.body).toHaveProperty('token');
  });
});
