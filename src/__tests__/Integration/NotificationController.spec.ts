import request from 'supertest';
import truncate from '@tests/util/truncate';
import factory from '@tests/factories';

import {
  createProject,
  createTokenAndUser2,
  createNotifications,
} from '@tests/util/functions';
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

describe('Notification', () => {
  beforeEach(async () => {
    await truncate();
  });

  afterAll(async () => {
    app.close();
  });
  it('should be able to create a notification', async () => {
    const { project, token } = await createProject();

    const notification = (await factory.attrs('Notification')) as Notification;
    const response = await request(app.server)
      .post(`/v1/pvt/${project.id}/notifications`)
      .set('Authorization', `bearer ${token}`)
      .send(notification);
    expect(response.body).toMatchObject(notification);
  });

  it('should not be able to create a notification if user is not a member in project', async () => {
    const { project } = await createProject();
    const user2 = await createTokenAndUser2();

    const notification = (await factory.attrs('Notification')) as Notification;
    const response = await request(app.server)
      .post(`/v1/pvt/${project.id}/notifications`)
      .set('Authorization', `bearer ${user2.token}`)
      .send(notification);
    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: "User isn't member this project",
      status: 'error',
    });
  });

  it('should be able to update a notification', async () => {
    const { project, token } = await createProject();
    const { notification } = await createNotifications(project.id, token);

    const notificationUpdate = (await factory.attrs(
      'Notification'
    )) as Notification;
    const response = await request(app.server)
      .put(`/v1/pvt/${project.id}/notifications/${notification.id}`)
      .set('Authorization', `bearer ${token}`)
      .send(notificationUpdate);
    expect(response.body).toMatchObject(notificationUpdate);
  });

  it('should be able to update a exist notification', async () => {
    const { project, token } = await createProject();

    const notificationUpdate = (await factory.attrs(
      'Notification'
    )) as Notification;
    const response = await request(app.server)
      .put(`/v1/pvt/${project.id}/notifications/1`)
      .set('Authorization', `bearer ${token}`)
      .send(notificationUpdate);
    expect(response.status).toBe(404);
    expect(response.body).toStrictEqual({
      message: 'Notification not found',
      status: 'error',
    });
  });

  it('should return notifications', async () => {
    const { project, token } = await createProject();
    await createNotifications(project.id, token);

    const response = await request(app.server)
      .get(`/v1/pvt/${project.id}/notifications/`)
      .set('Authorization', `bearer ${token}`);

    expect(response.body.length).toBe(1);
  });

  it('should not be able to return notifications if user is not a member in project', async () => {
    const { project } = await createProject();
    const user2 = await createTokenAndUser2();

    const response = await request(app.server)
      .get(`/v1/pvt/${project.id}/notifications/`)
      .set('Authorization', `bearer ${user2.token}`);

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: "User isn't member this project",
      status: 'error',
    });
  });

  it('should return one notifications', async () => {
    const { project, token } = await createProject();
    const { notification } = await createNotifications(project.id, token);

    const response = await request(app.server)
      .get(`/v1/pvt/${project.id}/notifications/${notification.id}`)
      .set('Authorization', `bearer ${token}`);

    expect(response.body.name).toBe(notification.name);
  });

  it('should not be able to return one notifications if user is not a member in project', async () => {
    const { project, token } = await createProject();
    const user2 = await createTokenAndUser2();

    const { notification } = await createNotifications(project.id, token);

    const response = await request(app.server)
      .get(`/v1/pvt/${project.id}/notifications/${notification.id}`)
      .set('Authorization', `bearer ${user2.token}`);

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: "User isn't member this project",
      status: 'error',
    });
  });

  it('should return not found if notification not exist', async () => {
    const { project, token } = await createProject();

    const response = await request(app.server)
      .get(`/v1/pvt/${project.id}/notifications/1`)
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toStrictEqual({
      message: 'Notification not found',
      status: 'error',
    });
  });

  it('should delete notifications', async () => {
    const { project, token } = await createProject();
    const { notification } = await createNotifications(project.id, token);

    const response = await request(app.server)
      .delete(`/v1/pvt/${project.id}/notifications/${notification.id}`)
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(204);
  });

  it('should not be able to delete notifications if user is not a member in project', async () => {
    const { project, token } = await createProject();
    const user2 = await createTokenAndUser2();

    const { notification } = await createNotifications(project.id, token);

    const response = await request(app.server)
      .delete(`/v1/pvt/${project.id}/notifications/${notification.id}`)
      .set('Authorization', `bearer ${user2.token}`);

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: "User isn't member this project",
      status: 'error',
    });
  });

  it('should return not found if notification not exist in delete request', async () => {
    const { project, token } = await createProject();

    const response = await request(app.server)
      .delete(`/v1/pvt/${project.id}/notifications/1`)
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toStrictEqual({
      message: 'Notification not found',
      status: 'error',
    });
  });
});
