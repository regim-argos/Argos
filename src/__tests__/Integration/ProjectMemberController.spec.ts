// eslint-disable-next-line import/no-extraneous-dependencies
import request from 'supertest';
import truncate from '../util/truncate';
import app from '../../app';
import {
  createProject,
  createTokenAndUser2,
  createProjectWith2Members,
} from '../util/functions';

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

describe('ProjectMember', () => {
  beforeEach(async () => {
    await truncate();
  });

  afterAll(async () => {
    app.close();
  });

  it('should be able to add a not argos user to project', async () => {
    const { token, project } = await createProject();

    const response = await request(app.server)
      .post(`/v1/pvt/${project.id}/projectMember`)
      .set('Authorization', `bearer ${token}`)
      .send({ email: 'test@argos.com' });

    expect(response.status).toBe(201);
  });

  it('should be able to add a argos user to project ', async () => {
    const { token, project } = await createProject();

    const response = await request(app.server)
      .post(`/v1/pvt/${project.id}/projectMember`)
      .set('Authorization', `bearer ${token}`)
      .send({ email: 'admin@argos2.com' });

    expect(response.status).toBe(201);
  });

  it('should not be able to add a member twice', async () => {
    const { token, project } = await createProjectWith2Members();

    const response = await request(app.server)
      .post(`/v1/pvt/${project.id}/projectMember`)
      .set('Authorization', `bearer ${token}`)
      .send({ email: 'admin@argos2.com' });

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: 'User is already a project member',
      status: 'error',
    });
  });

  it('should not be able to add a project member if not a owner', async () => {
    const { project } = await createProjectWith2Members();
    const { token: token2 } = await createTokenAndUser2();

    const response = await request(app.server)
      .post(`/v1/pvt/${project.id}/projectMember`)
      .set('Authorization', `bearer ${token2}`)
      .send({ email: 'test@argos.com' });

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: "User isn't a project owner",
      status: 'error',
    });
  });

  it('should not be able to add a project member if not in project', async () => {
    const { project } = await createProject();
    const { token } = await createTokenAndUser2();

    const response = await request(app.server)
      .post(`/v1/pvt/${project.id}/projectMember`)
      .set('Authorization', `bearer ${token}`)
      .send({ email: 'test@argos.com' });

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: "User isn't a project member",
      status: 'error',
    });
  });

  it('should be able to remove a user to project', async () => {
    const { token, project } = await createProjectWith2Members();

    const response = await request(app.server)
      .delete(`/v1/pvt/${project.id}/projectMember`)
      .set('Authorization', `bearer ${token}`)
      .send({ email: 'admin@argos2.com' });

    expect(response.status).toBe(200);
  });

  it('should be able return error when try remove a not project member', async () => {
    const { token, project } = await createProjectWith2Members();

    const response = await request(app.server)
      .delete(`/v1/pvt/${project.id}/projectMember`)
      .set('Authorization', `bearer ${token}`)
      .send({ email: 'test@argos.com' });

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: "User isn't a project member",
      status: 'error',
    });
  });

  it('should be able return error when try remove yourself', async () => {
    const { token, project } = await createProject();

    const response = await request(app.server)
      .delete(`/v1/pvt/${project.id}/projectMember`)
      .set('Authorization', `bearer ${token}`)
      .send({ email: 'admin@argos.com' });

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: "You can't remove yourself",
      status: 'error',
    });
  });
});
