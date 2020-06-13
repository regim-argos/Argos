// eslint-disable-next-line import/no-extraneous-dependencies
import request from 'supertest';
import {
  createProjectWith2Members,
  createTokenAndUser,
} from '@tests/util/functions';
import truncate from '../util/truncate';
import factory from '../factories';
import app from '../../app';
import User from '../../app/data/models/User';

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

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });

  afterAll(async () => {
    app.close();
  });

  it('should be able to register', async () => {
    const user = (await factory.attrs('User')) as User;

    const response = await request(app.server).post('/v1/pub/users').send(user);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('should not be able to register a registed email', async () => {
    const user = (await factory.attrs('User', {
      email: 'admin@argos2.com',
    })) as User;

    const response = await request(app.server).post('/v1/pub/users').send(user);

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: 'User already exists',
      status: 'error',
    });
  });

  it('should be able to register and add userId in project with have member with user email', async () => {
    const { token, project } = await createProjectWith2Members(
      'test@argos.com'
    );
    const user = (await factory.attrs('User', {
      email: 'test@argos.com',
    })) as User;

    const userResponse = await request(app.server)
      .post('/v1/pub/users')
      .send(user);

    const response = await request(app.server)
      .get(`/v1/pvt/projects/${project.id}`)
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(201);
    expect(response.body.members[1].userId).toBe(userResponse.body.id);
  });

  it('should be able to update a user', async () => {
    const { token } = await createTokenAndUser();

    const response = await request(app.server)
      .put('/v1/pvt/users')
      .send({
        name: 'test',
        oldPassword: 123456,
        password: 1234567,
        confirmPassword: 1234567,
      })
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
  });

  it('should not be able to update a user with invalid imageId', async () => {
    const { token } = await createTokenAndUser();

    const response = await request(app.server)
      .put('/v1/pvt/users')
      .send({
        name: 'test',
        imageId: 2,
        oldPassword: 123456,
        password: 1234567,
        confirmPassword: 1234567,
      })
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: 'Image not found',
      status: 'error',
    });
  });

  it('should not be able to update a user with invalid olaPassword', async () => {
    const { token } = await createTokenAndUser();

    const response = await request(app.server)
      .put('/v1/pvt/users')
      .send({
        name: 'test',
        oldPassword: 1234568,
        password: 1234567,
        confirmPassword: 1234567,
      })
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      message: 'Password does not match',
      status: 'error',
    });
  });
});
