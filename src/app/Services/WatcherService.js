/* eslint-disable import/no-cycle */
import WatcherValidator from '../Validators/WatcherValidator';
import Queue from '../../lib/Queue';
import Service from './Service';
import app from '../../app';
import UserServices from './UserServices';
import BadRequestError from '../Error/BadRequestError';
import NotificationService from './NotificationService';
import WatcherData from '../data/WatcherData';

class WatcherServices extends Service {
  constructor() {
    super('Watcher', WatcherData, WatcherValidator);
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
    if (validated.notifications?.length)
      await NotificationService.getAllByIds(
        validated.notifications.map((item) => item.id),
        userId
      );
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
    if (validated.notifications?.length)
      await NotificationService.getAllByIds(
        validated.notifications.map((item) => item.id),
        userId
      );
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

  async changeStatus(watcher) {
    await Promise.all(
      watcher.notifications.map(async (notification) => {
        await Queue.add(`${notification.platform}_NOTIFICATION`, {
          watcher,
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
