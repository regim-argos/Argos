/* eslint-disable import/no-cycle */
import WatcherValidator from '../Validators/WatcherValidator';
import Watcher from '../models/Watcher';
import Queue from '../../lib/Queue';
import Service from './Service';
import app from '../../app';
import UserServices from './UserServices';
import BadRequestError from '../Error/BadRequestError';
import Redis from '../../lib/Redis';

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

  async dbValidatorCreate(validated, userId) {
    const user = await UserServices.verifyAndGetUserById(userId);
    if (validated.delay < user.defaultDelay)
      throw new BadRequestError(
        `Watcher time can't be less than ${user.defaultDelay} seconds`
      );
    const watchers = await this.getAllByUserId(userId);
    if (user.watcherNumber < watchers.length)
      throw new BadRequestError(
        `Can't add another watcher, max number is ${user.watcherNumber}. Want more? upgrade your plan`
      );
  }

  async dbValidatorUpdate(validated, userId) {
    const user = await UserServices.verifyAndGetUserById(userId);
    if (validated.delay < user.defaultDelay)
      throw new BadRequestError(
        `Watcher time can't be less than ${user.defaultDelay} seconds`
      );
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

    await Promise.all(
      oldWatcher.notifications.map(async (notification) => {
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
    await Redis.invalidate(`${watcher.user_id}:watchers:all`);
    await Redis.invalidate(`${watcher.user_id}:watchers:${watcher.id}`);
  }
}

export default new WatcherServices();
