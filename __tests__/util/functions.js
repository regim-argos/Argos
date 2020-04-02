import request from 'supertest';

import app from '../../src/app';
import factory from '../factories';

async function createUser() {
  const user = await factory.attrs('User');

  await request(app.server).post('/v1/pub/users').send(user);
  return user;
}

async function createTokenAndUser(user) {
  const { body } = await request(app.server)
    .post('/v1/pub/sessions')
    .send({ email: 'admin@argos.com', password: '123456' });
  return { token: body.token, user };
}

export { createUser, createTokenAndUser };
