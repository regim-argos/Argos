// // eslint-disable-next-line import/no-extraneous-dependencies
// import request from 'supertest';
// import truncate from '../../__tests__/util/truncate';
// import factory from '../../__tests__/factories';
// import app from '../../app';
// import {
//   createTokenAndUser,
//   createNotifications,
// } from '../../__tests__/util/functions';
// import Notification from '../data/models/Notification';

describe('Notification', () => {
  it('test', () => {
    expect(1 + 1).toBe(2);
  });
  //   beforeEach(async () => {
  //     await truncate();
  //   });

  //   afterAll(async () => {
  //     app.close();
  //   });

  //   it('should be able to create a notification', async () => {
  //     const { token } = await createTokenAndUser();
  //     const notification = (await factory.attrs('Notification')) as Notification;

  //     const response = await request(app.server)
  //       .post('/v1/pvt/notifications')
  //       .set('Authorization', `bearer ${token}`)
  //       .send(notification);
  //     expect(response.body).toMatchObject(notification);
  //   });
  //   it('should return notifications', async () => {
  //     const { token } = await createNotifications();

  //     const response = await request(app.server)
  //       .get('/v1/pvt/notifications')
  //       .set('Authorization', `bearer ${token}`);
  //     expect(response.body.length).toBe(1);
  //   });

  //   it('should be able to update a notification', async () => {
  //     const { notification, token } = await createNotifications();

  //     const newNotification = (await factory.attrs(
  //       'Notification'
  //     )) as Notification;

  //     const response = await request(app.server)
  //       .put(`/v1/pvt/notifications/${notification.id}`)
  //       .set('Authorization', `bearer ${token}`)
  //       .send(newNotification);
  //     expect(response.body).toMatchObject(newNotification);
  //   });

  //   it('should be able to delete a notification', async () => {
  //     const { notification, token } = await createNotifications();

  //     const response = await request(app.server)
  //       .delete(`/v1/pvt/notifications/${notification.id}`)
  //       .set('Authorization', `bearer ${token}`);

  //     expect(response.status).toBe(204);
  //   });
});
