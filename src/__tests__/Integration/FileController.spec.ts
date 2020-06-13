// eslint-disable-next-line import/no-extraneous-dependencies
import request from 'supertest';
import { createTokenAndUser } from '@tests/util/functions';
import { resolve } from 'path';
import fs from 'fs';
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

describe('File', () => {
  beforeEach(async () => {
    await truncate();
  });

  afterAll(async () => {
    app.close();
  });

  it('should be able to create a file', async () => {
    const { token } = await createTokenAndUser();

    const response = await request(app.server)
      .post('/v1/pvt/files')
      .attach('file', resolve(__dirname, '..', 'util', 'test.png'))
      .set('Authorization', `bearer ${token}`);

    fs.unlinkSync(
      resolve(__dirname, '..', '..', '..', 'tmp', 'uploads', response.body.path)
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
  });
});
