// eslint-disable-next-line import/no-extraneous-dependencies
import request from 'supertest';
import truncate from '../util/truncate';
import factory from '../factories';
import app from '../../app';
import { createTokenAndUser } from '../util/functions';
import Project from '../../app/data/models/Project';

describe('Project', () => {
  beforeEach(async () => {
    await truncate();
  });

  afterAll(async () => {
    app.close();
  });

  it('should be able to create a project', async () => {
    const { token } = await createTokenAndUser();
    const project = (await factory.attrs('Project')) as Project;

    const response = await request(app.server)
      .post('/v1/pvt/projects')
      .set('Authorization', `bearer ${token}`)
      .send(project);
    expect(response.body).toMatchObject(project);
  });
  // it('should return projects', async () => {
  //   const { token } = await createProjects();

  //   const response = await request(app.server)
  //     .get('/v1/pvt/projects')
  //     .set('Authorization', `bearer ${token}`);
  //   expect(response.body.length).toBe(1);
  // });

  // it('should be able to update a project', async () => {
  //   const { project, token } = await createProjects();

  //   const newProject = (await factory.attrs(
  //     'Project'
  //   )) as Project;

  //   const response = await request(app.server)
  //     .put(`/v1/pvt/projects/${project.id}`)
  //     .set('Authorization', `bearer ${token}`)
  //     .send(newProject);
  //   expect(response.body).toMatchObject(newProject);
  // });

  // it('should be able to delete a project', async () => {
  //   const { project, token } = await createProjects();

  //   const response = await request(app.server)
  //     .delete(`/v1/pvt/projects/${project.id}`)
  //     .set('Authorization', `bearer ${token}`);

  //   expect(response.status).toBe(204);
  // });
});
