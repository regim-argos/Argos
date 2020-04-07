/* eslint-disable import/no-cycle */
import WatcherValidator from '../Validators/WatcherValidator';
import Watcher from '../models/Watcher';
import Queue from '../../lib/Queue';
import Service from './Service';
import NotificationService from './NotificationService';
import app from '../../app';

class WatcherServices extends Service {
  constructor() {
    super('Watcher', Watcher, WatcherValidator);
  }

  async create(data, userId) {
    const watcher = await super.create(data, userId);

    if (watcher.active)
      await Queue.addRepeatJob('Watcher', watcher, {
        every: watcher.delay * 1000,
      });

    return watcher;
  }

  async update(data, id, userId) {
    const { old, newValue } = await super.update(data, id, userId, true);

    await Queue.remove('Watcher', old.delay * 1000, old.id);
    if (newValue.active)
      await Queue.addRepeatJob('Watcher', newValue, {
        every: newValue.delay * 1000,
      });

    return newValue;
  }

  async delete(id, userId) {
    const watcher = await super.delete(id, userId);

    await Queue.remove('Watcher', watcher.delay * 1000, watcher.id);

    return watcher;
  }

  async changeStatus(status, id, userId) {
    const oldWatcher = await this.verifyAndGet(id, userId, 'ADMIN');

    const watcher = await this.model.ChangeWatcherStatusById(
      { status, lastChange: new Date() },
      id
    );

    const notifications = await NotificationService.getAllByWatcherId(id);

    Promise.all(
      notifications.map(async (notification) => {
        await Queue.add(`${notification.platform}_NOTIFICATION`, {
          watcher,
          oldWatcher,
          notification,
        });
      })
    );
    await app.socketIo.sendNotification(
      watcher.user_id,
      'ChangeStatus',
      watcher
    );
  }
}

export default new WatcherServices();
