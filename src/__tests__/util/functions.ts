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
async function createTokenAndUser2() {
  const { body } = await request(app.server)
    .post('/v1/pub/sessions')
    .send({ email: 'admin@argos2.com', password: '123456' });
  return { token: body.token, user: body.user as User };
}
async function createProject() {
  const { user, token } = await createTokenAndUser();
  const project = (await factory.attrs('Project')) as Project;

  const response = await request(app.server)
    .post('/v1/pvt/projects')
    .set('Authorization', `bearer ${token}`)
    .send(project);
  return { project: response.body as Project, token, user };
}

async function createProjectWith2Members(email = 'admin@argos2.com') {
  const { token, project, user } = await createProject();

  await request(app.server)
    .post(`/v1/pvt/${project.id}/projectMember`)
    .set('Authorization', `bearer ${token}`)
    .send({ email });

  return { token, project, user };
}

async function createNotifications(projectId: number, token: string) {
  const notification = (await factory.attrs('Notification')) as Notification;

  const response = await request(app.server)
    .post(`/v1/pvt/${projectId}/notifications`)
    .set('Authorization', `bearer ${token}`)
    .send(notification);

  return { notification: response.body as Notification, token };
}

async function createWatchers(projectId: number, token: string) {
  const watcher = (await factory.attrs('Watcher')) as Watcher;

  const response = await request(app.server)
    .post(`/v1/pvt/${projectId}/watchers`)
    .set('Authorization', `bearer ${token}`)
    .send(watcher);
  return { watcher: response.body as Watcher };
}

export {
  createTokenAndUser,
  createProject,
  createNotifications,
  createWatchers,
  createProjectWith2Members,
  createTokenAndUser2,
};
