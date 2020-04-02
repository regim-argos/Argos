/* eslint-disable no-undef */
import request from 'supertest';

import app from '../../src/app';

import truncate from '../util/truncate';
import Queue from '../../src/lib/Queue';
import Hash from '../../src/app/models/Hash';
import User from '../../src/app/models/User';

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

  it('should be able to request a forgetPassword ', async () => {
    Queue.add.mockResolvedValue();

    const response = await request(app.server)
      .post('/v1/pub/forgetPassword')
      .send({ email: 'admin@argos.com' });
    expect(response.status).toBe(204);
    expect(Queue.add).toHaveBeenCalledTimes(1);
  });

  it('should not be able to request a forgetPassword if active is false', async () => {
    await truncate(false);
    Queue.add.mockResolvedValue();

    const response = await request(app.server)
      .post('/v1/pub/forgetPassword')
      .send({ email: 'admin@argos.com' });
    expect(response.status).toBe(400);
    expect(Queue.add).toHaveBeenCalledTimes(0);
  });

  it('should be able to forgetPassword', async () => {
    Queue.add.mockResolvedValue();
    await request(app.server)
      .post('/v1/pub/forgetPassword')
      .send({ email: 'admin@argos.com' });

    const DocHash = await Hash.findOne({
      include: [
        {
          model: User,
          where: { email: 'admin@argos.com' },
        },
      ],
    });

    await request(app.server)
      .put(`/v1/pub/forgetPassword/${DocHash.hash}`)
      .send({ password: '1234567', confirmPassword: '1234567' });

    const response = await request(app.server)
      .post(`/v1/pub/sessions`)
      .send({ email: 'admin@argos.com', password: '1234567' });

    expect(response.status).toBe(201);
  });

  // it('should not be able to request a confirmEmail if is actived', async () => {
  //   Queue.add.mockResolvedValue();

  //   const response = await request(app.server)
  //     .post('/v1/pub/confirmEmail')
  //     .send({ email: 'admin@argos.com' });

  //   expect(response.status).toBe(400);
  //   expect(response.body.message).toMatch(/Email already confirmed/);
  // });

  // it('should not be able to request a confirmEmail if user not exists', async () => {
  //   Queue.add.mockResolvedValue();

  //   const response = await request(app.server)
  //     .post('/v1/pub/confirmEmail')
  //     .send({ email: 'admin1@argos.com' });

  //   expect(response.status).toBe(404);
  //   expect(response.body.message).toMatch(/User not found/);
  // });
});
