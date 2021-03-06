// eslint-disable-next-line import/no-extraneous-dependencies
import request from 'supertest';
import truncate from '../util/truncate';
import factory from '../factories';
import app from '../../app';
import { createTokenAndUser, createProject } from '../util/functions';
import Project from '../../app/data/models/Project';

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
jest.mock('../../lib/Rabbit');

describe('Project', () => {
  beforeEach(async () => {
    await truncate();
  });

  afterAll(async () => {
    app.close();
  });

  it('should be able to create a project', async () => {
    const { user, token } = await createTokenAndUser();
    const project = (await factory.attrs('Project')) as Project;

    const response = await request(app.server)
      .post('/v1/pvt/projects')
      .set('Authorization', `bearer ${token}`)
      .send(project);

    expect(response.body).toMatchObject({
      ...project,
      members: [{ userId: user.id, role: 'OWNER' }],
    });
  });

  it('should be able to create only one project', async () => {
    const { token } = await createProject();
    const project = (await factory.attrs('Project')) as Project;

    const response = await request(app.server)
      .post('/v1/pvt/projects')
      .set('Authorization', `bearer ${token}`)
      .send(project);

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: 'A user can create only one project',
      status: 'error',
    });
  });

  it('should be able to get project list', async () => {
    const { token } = await createProject();

    const response = await request(app.server)
      .get('/v1/pvt/projects')
      .set('Authorization', `bearer ${token}`);

    expect(response.body.length).toBe(1);
  });

  it('should be able to get a owner project', async () => {
    const { token, project } = await createProject();

    const response = await request(app.server)
      .get(`/v1/pvt/projects/${project.id}`)
      .set('Authorization', `bearer ${token}`);

    expect(response.body.id).toBe(project.id);
  });

  it('should be able to return error if invalid projectId', async () => {
    const { token, project } = await createProject();

    const response = await request(app.server)
      .get(`/v1/pvt/projects/test${project.id}`)
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: 'Invalid PorjectId',
    });
  });
});
