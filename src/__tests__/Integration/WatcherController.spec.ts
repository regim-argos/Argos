// eslint-disable-next-line import/no-extraneous-dependencies
import request from 'supertest';
import truncate from '@tests/util/truncate';
import factory from '@tests/factories';
import {
  createProject,
  createTokenAndUser2,
  createWatchers,
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

    const watcher = (await factory.attrs('Watcher')) as Watcher;
    const response = await request(app.server)
      .post(`/v1/pvt/${project.id}/watchers`)
      .set('Authorization', `bearer ${token}`)
      .send(watcher);
    expect(response.body).toMatchObject(watcher);
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

    const watcher = (await factory.attrs('Watcher', { delay: 10 })) as Watcher;
    const response = await request(app.server)
      .post(`/v1/pvt/${project.id}/watchers`)
      .set('Authorization', `bearer ${user2.token}`)
      .send(watcher);
    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: "User isn't member this project",
      status: 'error',
    });
  });

  // it('should return watchers', async () => {
  //   const { token } = await createWatchers();

  //   const response = await request(app.server)
  //     .get('/v1/pvt/watchers')
  //     .set('Authorization', `bearer ${token}`);
  //   expect(response.body.length).toBe(1);
  // });

  //   it('should be able to update a watcher', async () => {
  //     const { watcher, token } = await createWatchers();

  //     const newWatcher = (await factory.attrs('Watcher')) as Watcher;

  //     const response = await request(app.server)
  //       .put(`/v1/pvt/watchers/${watcher.id}`)
  //       .set('Authorization', `bearer ${token}`)
  //       .send(newWatcher);
  //     expect(response.body).toMatchObject(newWatcher);
  //   });

  //   it('should be able to delete a watcher', async () => {
  //     const { watcher, token } = await createWatchers();

  //     const response = await request(app.server)
  //       .delete(`/v1/pvt/watchers/${watcher.id}`)
  //       .set('Authorization', `bearer ${token}`);

  //     expect(response.status).toBe(204);
  //   });
});
