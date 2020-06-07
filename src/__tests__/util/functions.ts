import request from 'supertest';
import factory from '../factories';

import app from '../../app';
import Notification from '../../app/data/models/Notification';
import Watcher from '../../app/data/models/Watcher';
import User from '../../app/data/models/User';
import Project from '../../app/data/models/Project';

async function createTokenAndUser() {
  const { body } = await request(app.server)
    .post('/v1/pub/sessions')
    .send({ email: 'admin@argos.com', password: '123456' });
  return { token: body.token, user: body.user as User };
}
async function createProject() {
  const { user, token } = await createTokenAndUser();
  const project = (await factory.attrs('Project')) as Project;

  const response = await request(app.server)
    .post('/v1/pvt/projects')
    .set('Authorization', `bearer ${token}`)
    .send(project);
  return { project: response.body, token, user };
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

export {
  createTokenAndUser,
  createProject,
  createNotifications,
  createWatchers,
};
