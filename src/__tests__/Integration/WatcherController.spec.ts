// eslint-disable-next-line import/no-extraneous-dependencies
import request from 'supertest';
import truncate from '@tests/util/truncate';
import factory from '@tests/factories';
import {
  createProject,
  createTokenAndUser2,
  createWatchers,
  createNotifications,
} from '@tests/util/functions';
import app from '../../app';
import Watcher from '../../app/data/models/Watcher';

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

describe('Watcher', () => {
  beforeEach(async () => {
    await truncate();
  });

  afterAll(async () => {
    app.close();
  });

  it('should be able to create a watcher', async () => {
    const { project, token } = await createProject();
    const { notification } = await createNotifications(project.id, token);

    const watcher = ((await factory.attrs('Watcher', {
      notifications: [{ id: notification.id }],
    })) as unknown) as Watcher;

    const response = await request(app.server)
      .post(`/v1/pvt/${project.id}/watchers`)
      .set('Authorization', `bearer ${token}`)
      .send(watcher);
    expect(response.body).toMatchObject(watcher);
  });

  it('should not be able to create a with invalid notifications ids', async () => {
    const { project, token } = await createProject();
    const { notification } = await createNotifications(project.id, token);

    const watcher = ((await factory.attrs('Watcher', {
      notifications: [{ id: notification.id + 1 }],
    })) as unknown) as Watcher;

    const response = await request(app.server)
      .post(`/v1/pvt/${project.id}/watchers`)
      .set('Authorization', `bearer ${token}`)
      .send(watcher);
    expect(response.body).toStrictEqual({
      message: 'Notification(s) not found',
      status: 'error',
    });
  });

  it('should not be able to create a watcher with less permite delay', async () => {
    const { project, token } = await createProject();

    const watcher = (await factory.attrs('Watcher', { delay: 10 })) as Watcher;
    const response = await request(app.server)
      .post(`/v1/pvt/${project.id}/watchers`)
      .set('Authorization', `bearer ${token}`)
      .send(watcher);
    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: "Watcher time can't be less than 60 seconds",
      status: 'error',
    });
  });

  it('should not be able to create a watcher with less permite delay', async () => {
    const { project, token } = await createProject();
    await createWatchers(project.id, token);
    await createWatchers(project.id, token);
    await createWatchers(project.id, token);
    await createWatchers(project.id, token);
    await createWatchers(project.id, token);

    const watcher = (await factory.attrs('Watcher')) as Watcher;
    const response = await request(app.server)
      .post(`/v1/pvt/${project.id}/watchers`)
      .set('Authorization', `bearer ${token}`)
      .send(watcher);
    expect(response.body).toStrictEqual({
      message:
        "Can't add another watcher, max number is 5. Want more? upgrade your plan",
      status: 'error',
    });
  });

  it('should not be able to create a watcher if user is not a member in project', async () => {
    const { project } = await createProject();
    const user2 = await createTokenAndUser2();

    const watcher = (await factory.attrs('Watcher')) as Watcher;
    const response = await request(app.server)
      .post(`/v1/pvt/${project.id}/watchers`)
      .set('Authorization', `bearer ${user2.token}`)
      .send(watcher);
    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: "User isn't a project member",
      status: 'error',
    });
  });

  it('should be able to update a watcher', async () => {
    const { project, token } = await createProject();
    const { watcher } = await createWatchers(project.id, token);
    const { notification } = await createNotifications(project.id, token);

    const watcherUpdate = ((await factory.attrs('Watcher', {
      notifications: [{ id: notification.id }],
    })) as unknown) as Watcher;

    const response = await request(app.server)
      .put(`/v1/pvt/${project.id}/watchers/${watcher.id}`)
      .set('Authorization', `bearer ${token}`)
      .send(watcherUpdate);
    expect(response.body).toMatchObject(watcherUpdate);
  });

  it('should not be able to update a watcher with invalid notification id', async () => {
    const { project, token } = await createProject();
    const { watcher } = await createWatchers(project.id, token);
    const { notification } = await createNotifications(project.id, token);

    const watcherUpdate = ((await factory.attrs('Watcher', {
      notifications: [{ id: notification.id + 1 }],
    })) as unknown) as Watcher;

    const response = await request(app.server)
      .put(`/v1/pvt/${project.id}/watchers/${watcher.id}`)
      .set('Authorization', `bearer ${token}`)
      .send(watcherUpdate);
    expect(response.body).toStrictEqual({
      message: 'Notification(s) not found',
      status: 'error',
    });
  });

  it('should be able to update a exist watcher', async () => {
    const { project, token } = await createProject();

    const watcherUpdate = (await factory.attrs('Watcher')) as Watcher;
    const response = await request(app.server)
      .put(`/v1/pvt/${project.id}/watchers/1`)
      .set('Authorization', `bearer ${token}`)
      .send(watcherUpdate);
    expect(response.status).toBe(404);
    expect(response.body).toStrictEqual({
      message: 'Watcher not found',
      status: 'error',
    });
  });

  it('should not be able to update a watcher with less permite delay', async () => {
    const { project, token } = await createProject();
    const { watcher } = await createWatchers(project.id, token);

    const watcherUpdate = (await factory.attrs('Watcher', {
      delay: 10,
    })) as Watcher;
    const response = await request(app.server)
      .put(`/v1/pvt/${project.id}/watchers/${watcher.id}`)
      .set('Authorization', `bearer ${token}`)
      .send(watcherUpdate);
    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: "Watcher time can't be less than 60 seconds",
      status: 'error',
    });
  });

  it('should return watchers', async () => {
    const { project, token } = await createProject();
    await createWatchers(project.id, token);

    const response = await request(app.server)
      .get(`/v1/pvt/${project.id}/watchers/`)
      .set('Authorization', `bearer ${token}`);

    expect(response.body.length).toBe(1);
  });

  it('should not be able to return watchers if user is not a member in project', async () => {
    const { project } = await createProject();
    const user2 = await createTokenAndUser2();

    const response = await request(app.server)
      .get(`/v1/pvt/${project.id}/watchers/`)
      .set('Authorization', `bearer ${user2.token}`);

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: "User isn't a project member",
      status: 'error',
    });
  });

  it('should return one watchers', async () => {
    const { project, token } = await createProject();
    const { watcher } = await createWatchers(project.id, token);

    const response = await request(app.server)
      .get(`/v1/pvt/${project.id}/watchers/${watcher.id}`)
      .set('Authorization', `bearer ${token}`);

    expect(response.body.name).toBe(watcher.name);
  });

  it('should not be able to return one watchers if user is not a member in project', async () => {
    const { project, token } = await createProject();
    const user2 = await createTokenAndUser2();

    const { watcher } = await createWatchers(project.id, token);

    const response = await request(app.server)
      .get(`/v1/pvt/${project.id}/watchers/${watcher.id}`)
      .set('Authorization', `bearer ${user2.token}`);

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: "User isn't a project member",
      status: 'error',
    });
  });

  it('should return not found if watcher not exist', async () => {
    const { project, token } = await createProject();

    const response = await request(app.server)
      .get(`/v1/pvt/${project.id}/watchers/1`)
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toStrictEqual({
      message: 'Watcher not found',
      status: 'error',
    });
  });

  it('should delete watchers', async () => {
    const { project, token } = await createProject();
    const { watcher } = await createWatchers(project.id, token);

    const response = await request(app.server)
      .delete(`/v1/pvt/${project.id}/watchers/${watcher.id}`)
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(204);
  });

  it('should not be able to delete watchers if user is not a member in project', async () => {
    const { project, token } = await createProject();
    const user2 = await createTokenAndUser2();

    const { watcher } = await createWatchers(project.id, token);

    const response = await request(app.server)
      .delete(`/v1/pvt/${project.id}/watchers/${watcher.id}`)
      .set('Authorization', `bearer ${user2.token}`);

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: "User isn't a project member",
      status: 'error',
    });
  });

  it('should return not found if watcher not exist in delete request', async () => {
    const { project, token } = await createProject();

    const response = await request(app.server)
      .delete(`/v1/pvt/${project.id}/watchers/1`)
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toStrictEqual({
      message: 'Watcher not found',
      status: 'error',
    });
  });
});
