// eslint-disable-next-line import/no-extraneous-dependencies
import request from 'supertest';
import { createTokenAndUser } from '@tests/util/functions';
import truncate from '../util/truncate';
import app from '../../app';

jest.mock('../../lib/Queue', () => ({
  add: jest.fn().mockResolvedValue(undefined),
  addRepeatJob: jest.fn().mockResolvedValue(undefined),
  remove: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../../lib/Rabbit');

jest.mock('../../lib/Redis', () => ({
  set: jest.fn().mockResolvedValue(undefined),
  get: jest.fn().mockResolvedValue(undefined),
  invalidate: jest.fn().mockResolvedValue(undefined),
  invalidatePrefix: jest.fn().mockResolvedValue(undefined),
}));

describe('Session', () => {
  beforeEach(async () => {
    await truncate();
  });

  afterAll(async () => {
    app.close();
  });

  it('should be able to create session', async () => {
    const response = await request(app.server)
      .post('/v1/pub/sessions')
      .send({ email: 'admin@argos.com', password: '123456' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
  });

  it('should be not able to create session with wrong password', async () => {
    const response = await request(app.server)
      .post('/v1/pub/sessions')
      .send({ email: 'admin@argos.com', password: '1234567' });

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: 'Invalid credentials',
      status: 'error',
    });
  });

  it('should be not able to create session with wrong email', async () => {
    const response = await request(app.server)
      .post('/v1/pub/sessions')
      .send({ email: 'admin@argostest.com', password: '123456' });

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: 'Invalid credentials',
      status: 'error',
    });
  });

  it('should be not able to create session with wrong email', async () => {
    const response = await request(app.server)
      .post('/v1/pub/sessions')
      .send({ email: 'admin@argostest.com', password: '123456' });

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: 'Invalid credentials',
      status: 'error',
    });
  });

  it('should be able to request pub test', async () => {
    const response = await request(app.server).get('/v1/pub/');

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({ message: 'ok Argos' });
  });

  it('should be able to request pvt test', async () => {
    const { token } = await createTokenAndUser();

    const response = await request(app.server)
      .get('/v1/pvt/testAuth')
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({ message: 'ok Auth argos' });
  });

  it('should not be able to request pvt test without token', async () => {
    const response = await request(app.server).get('/v1/pvt/testAuth');

    expect(response.status).toBe(401);
    expect(response.body).toStrictEqual({ message: 'Token not provided' });
  });

  it('should not be able to request pvt test with wrong token', async () => {
    const { token } = await createTokenAndUser();

    const response = await request(app.server)
      .get('/v1/pvt/testAuth')
      .set('Authorization', `bearer ${token}test`);

    expect(response.status).toBe(401);
    expect(response.body).toStrictEqual({ message: 'Invalid token' });
  });
});
