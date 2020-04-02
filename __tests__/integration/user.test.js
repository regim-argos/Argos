/* eslint-disable no-undef */
import request from 'supertest';
import app from '../../src/app';

import truncate from '../util/truncate';
import factory from '../factories';
import Queue from '../../src/lib/Queue';

import { createTokenAndUser } from '../util/functions';

jest.mock('../../src/lib/Queue', () => ({
  add: jest.fn(),
}));

describe('User Create', () => {
  beforeEach(async () => {
    await truncate();
  });

  afterAll(async () => {
    app.close();
  });

  it('should be able to register', async () => {
    const user = await factory.attrs('User');
    Queue.add.mockResolvedValue();

    const response = await request(app.server)
      .post('/v1/pub/users')
      .send(user);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('should be able to update a name', async () => {
    const { token } = await createTokenAndUser();

    const response = await request(app.server)
      .put('/v1/pvt/users')
      .set('Authorization', `bearer ${token}`)
      .send({ name: 'Test Name' });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ name: 'Test Name' });
  });
  // it('should encrypt user password when new user created', async () => {
  //   const user = await factory.create('User', {
  //     password: '123456',
  //   });
  //   const compareHash = await bcrypt.compare('123456', user.password_hash);

  //   expect(compareHash).toBe(true);
  // });

  // it('should not be able to register with duplicated email', async () => {
  //   const user = await factory.attrs('User', {
  //     email: 'diogomachado_8@hotmail.com',
  //   });

  //   await request(app.server)
  //     .post('/users')
  //     .send(user);

  //   const user2 = await factory.attrs('User', {
  //     email: 'diogomachado_8@hotmail.com',
  //   });

  //   const response = await request(app.server)
  //     .post('/users')
  //     .send(user2);

  //   expect(response.status).toBe(400);
  // });
});
