// eslint-disable-next-line import/no-extraneous-dependencies
import request from 'supertest';
import truncate from '@tests/util/truncate';
import { createProject, createWatchers } from '@tests/util/functions';
import Event from '@app/data/models/Event';
import app from '../../app';

jest.mock('../../lib/Queue', () => ({
  add: jest.fn().mockResolvedValue(undefined),
  addRepeatJob: jest.fn().mockResolvedValue(undefined),
  remove: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../../lib/Rabbit');

jest.mock('../../lib/Redis', () => ({
  set: jest.fn().mockResolvedValue(undefined),
  get: jest.fn().mockResolvedValue(undefined),
  invalidate: jest.fn().mockResolvedValue(undefined),
  invalidatePrefix: jest.fn().mockResolvedValue(undefined),
}));

describe('Watcher Detail', () => {
  beforeEach(async () => {
    await truncate();
  });

  afterAll(async () => {
    app.close();
  });

  it('should return watchers details', async () => {
    const { project, token } = await createProject();
    const { watcher } = await createWatchers(project.id, token);

    await Event.createOne(watcher.id, true, new Date());

    const response = await request(app.server)
      .get(`/v1/pvt/${project.id}/watchersDetail/${watcher.id}`)
      .set('Authorization', `bearer ${token}`);

    expect(response.body.events.length).toBe(1);
  });

  it('should return 2 events', async () => {
    const { project, token } = await createProject();
    const { watcher } = await createWatchers(project.id, token);

    await Event.createOne(watcher.id, true, new Date());

    await Event.createOne(watcher.id, false, new Date());

    const response = await request(app.server)
      .get(`/v1/pvt/${project.id}/watchersDetail/${watcher.id}`)
      .set('Authorization', `bearer ${token}`);

    expect(response.body.events.length).toBe(2);
  });
});
