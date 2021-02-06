// eslint-disable-next-line import/no-extraneous-dependencies
import request from 'supertest';
import { createTokenAndUser } from '@tests/util/functions';
import Hash from '@app/data/models/Hash';
import truncate from '../util/truncate';
import app from '../../app';

jest.mock('../../lib/Queue', () => ({
  add: jest.fn().mockResolvedValue(undefined),
  addRepeatJob: jest.fn().mockResolvedValue(undefined),
  remove: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../../lib/Redis', () => ({
  set: jest.fn().mockResolvedValue(undefined),
  get: jest.fn().mockResolvedValue(undefined),
  invalidate: jest.fn().mockResolvedValue(undefined),
  invalidatePrefix: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../../lib/Rabbit');

describe('forgetPassword', () => {
  beforeEach(async () => {
    await truncate();
  });

  afterAll(async () => {
    app.close();
  });

  it('should be able to create forgetPassword', async () => {
    const response = await request(app.server)
      .post('/v1/pub/forgetPassword')
      .send({ email: 'admin@argos.com' });
    expect(response.status).toBe(204);
  });

  it('should not be able to create forgetPassword if email not found', async () => {
    const response = await request(app.server)
      .post('/v1/pub/forgetPassword')
      .send({ email: 'admin@argos1.com' });

    expect(response.status).toBe(404);
    expect(response.body).toStrictEqual({
      message: 'User not found',
      status: 'error',
    });
  });

  it('should not be able to create forgetPassword if email undefined', async () => {
    const response = await request(app.server)
      .post('/v1/pub/forgetPassword')
      .send();

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: 'Email is required',
      status: 'error',
    });
  });

  it('should not be able to create forgetPassword if email not confirmed', async () => {
    await truncate(false);
    const response = await request(app.server)
      .post('/v1/pub/forgetPassword')
      .send({ email: 'admin@argos.com' });

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: 'Email need confirmed',
      status: 'error',
    });
  });

  it('should be able to forget password', async () => {
    const { user } = await createTokenAndUser();

    await request(app.server)
      .post('/v1/pub/forgetPassword')
      .send({ email: 'admin@argos.com' });

    const hash = await Hash.findOne({
      where: {
        user_id: user.id,
        type: 'CHANGE_PASSWORD',
      },
    });

    const response = await request(app.server)
      .put(`/v1/pub/forgetPassword/${hash?.hash}`)
      .send({ password: '1234567', confirmPassword: '1234567' });

    expect(response.status).toBe(204);
  });

  it('should not be able to forget password without password/confirmPassword', async () => {
    const { user } = await createTokenAndUser();

    await request(app.server)
      .post('/v1/pub/forgetPassword')
      .send({ email: 'admin@argos.com' });

    const hash = await Hash.findOne({
      where: {
        user_id: user.id,
        type: 'CHANGE_PASSWORD',
      },
    });

    const response = await request(app.server).put(
      `/v1/pub/forgetPassword/${hash?.hash}`
    );

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: 'password is a required field',
      status: 'error',
    });
  });

  it('should not be able to forget password with invalid hash', async () => {
    const { user } = await createTokenAndUser();

    await request(app.server)
      .post('/v1/pub/forgetPassword')
      .send({ email: 'admin@argos.com' });

    const hash = await Hash.findOne({
      where: {
        user_id: user.id,
        type: 'CHANGE_PASSWORD',
      },
    });

    const response = await request(app.server).put(
      `/v1/pub/forgetPassword/${hash?.hash}2`
    );

    expect(response.status).toBe(400);
  });
});
