/* eslint-disable no-undef */
import request from 'supertest';
import app from '../../src/app';

import truncate from '../util/truncate';

describe('Session Create', () => {
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

    expect(response.body).toHaveProperty('token');
  });

  it('should return a valid token to use API', async () => {
    const {
      body: { token },
    } = await request(app.server)
      .post('/v1/pub/sessions')
      .send({ email: 'admin@argos.com', password: '123456' });

    const response = await request(app.server)
      .get('/v1/pvt/testAuth')
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it('should have a valid token to use API', async () => {
    const response = await request(app.server)
      .get('/v1/pvt/testAuth')
      .set('Authorization', `bearer testwoken`);
    expect(response.status).toBe(401);
  });

  it('should have a token to use API', async () => {
    const response = await request(app.server).get('/v1/pvt/testAuth');

    expect(response.status).toBe(401);
  });
});
