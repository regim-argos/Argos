// eslint-disable-next-line import/no-extraneous-dependencies
import request from 'supertest';
import truncate from '../util/truncate';
import factory from '../factories';
import app from '../../app';
import { createTokenAndUser, createProject } from '../util/functions';
import Project from '../../app/data/models/Project';

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
});
