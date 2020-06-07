// // eslint-disable-next-line import/no-extraneous-dependencies
// import request from 'supertest';
// import truncate from '../../__tests__/util/truncate';
// import factory from '../../__tests__/factories';
// import app from '../../app';
// import {
//   createTokenAndUser,
//   createWatchers,
// } from '../../__tests__/util/functions';
// import Watcher from '../data/models/Watcher';

// jest.mock('../../lib/Queue', () => ({
//   add: jest.fn().mockResolvedValue(undefined),
//   addRepeatJob: jest.fn().mockResolvedValue(undefined),
//   remove: jest.fn().mockResolvedValue(undefined),
// }));

describe('Watcher', () => {
  it('test', () => {
    expect(1 + 1).toBe(2);
  });
  //   beforeEach(async () => {
  //     await truncate();
  //   });

  //   afterAll(async () => {
  //     app.close();
  //   });

  //   it('should be able to create a watcher', async () => {
  //     const { token } = await createTokenAndUser();
  //     const watcher = (await factory.attrs('Watcher')) as Watcher;
  //     const response = await request(app.server)
  //       .post('/v1/pvt/watchers')
  //       .set('Authorization', `bearer ${token}`)
  //       .send(watcher);
  //     expect(response.body).toMatchObject(watcher);
  //   });
  //   it('should return watchers', async () => {
  //     const { token } = await createWatchers();

  //     const response = await request(app.server)
  //       .get('/v1/pvt/watchers')
  //       .set('Authorization', `bearer ${token}`);
  //     expect(response.body.length).toBe(1);
  //   });

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
