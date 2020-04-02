/* eslint-disable no-undef */
import request from 'supertest';

import app from '../../src/app';

import truncate from '../util/truncate';
import Queue from '../../src/lib/Queue';

jest.mock('../../src/lib/Queue', () => ({
  add: jest.fn(),
}));

describe('confirmEmail', () => {
  beforeEach(async () => {
    await truncate();
  });

  afterAll(async () => {
    app.close();
  });

  it('should be able to request a confirmEmail ', async () => {
    await truncate(false);

    Queue.add.mockResolvedValue();

    const response = await request(app.server)
      .post('/v1/pub/confirmEmail')
      .send({ email: 'admin@argos.com' });
    expect(Queue.add).toHaveBeenCalledTimes(1);

    expect(response.status).toBe(204);
  });

  it('should not be able to request a confirmEmail if is actived', async () => {
    Queue.add.mockResolvedValue();

    const response = await request(app.server)
      .post('/v1/pub/confirmEmail')
      .send({ email: 'admin@argos.com' });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/Email already confirmed/);
  });

  it('should not be able to request a confirmEmail if user not exists', async () => {
    Queue.add.mockResolvedValue();

    const response = await request(app.server)
      .post('/v1/pub/confirmEmail')
      .send({ email: 'admin1@argos.com' });

    expect(response.status).toBe(404);
    expect(response.body.message).toMatch(/User not found/);
  });
});
