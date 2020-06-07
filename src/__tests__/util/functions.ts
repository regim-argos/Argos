import request from 'supertest';
import factory from '../factories';

import app from '../../app';
import Notification from '../../app/data/models/Notification';
import Watcher from '../../app/data/models/Watcher';

async function createTokenAndUser() {
  const { body } = await request(app.server)
    .post('/v1/pub/sessions')
    .send({ email: 'admin@argos.com', password: '123456' });
  return { token: body.token, user: body.user };
}
async function createNotifications() {
  const { token } = await createTokenAndUser();
  const notification = (await factory.attrs('Notification')) as Notification;

  const response = await request(app.server)
    .post('/v1/pvt/notifications')
    .set('Authorization', `bearer ${token}`)
    .send(notification);
  return { notification: response.body, token };
}

async function createWatchers() {
  const { token } = await createTokenAndUser();
  const watcher = (await factory.attrs('Watcher')) as Watcher;

  const response = await request(app.server)
    .post('/v1/pvt/watchers')
    .set('Authorization', `bearer ${token}`)
    .send(watcher);
  return { watcher: response.body, token };
}

export { createTokenAndUser, createNotifications, createWatchers };
