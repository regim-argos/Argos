/* eslint-disable import/no-cycle */
import WatcherValidator from '../Validators/WatcherValidator';
import Queue from '../../lib/Queue';
import Service from './Service';
import app from '../../app';
import UserServices from './UserServices';
import BadRequestError from '../Error/BadRequestError';
import NotificationService from './NotificationService';
import WatcherData from '../data/WatcherData';
import Watcher from '../data/models/Watcher';

class WatcherServices extends Service<Watcher> {
  public name = 'Watcher';

  protected model = WatcherData;

  public validator = WatcherValidator;

  async create(data: object, userId: number) {
    const watcher = await super.create(data, userId);

    if (watcher.active)
      await Queue.addRepeatJob('Watcher', watcher, {
        every: watcher.delay * 1000,
      });

    return watcher;
  }

  async dbValidatorCreate(validated: Watcher, userId: number) {
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

  async dbValidatorUpdate(validated: Watcher, userId: number) {
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

  async update(data: object, id: number, userId: number) {
    const { old, newValue } = await super.updateWithReturn(data, id, userId);

    await Queue.remove('Watcher', old.delay * 1000, old.id);
    if (newValue.active)
      await Queue.addRepeatJob('Watcher', newValue, {
        every: newValue.delay * 1000,
      });

    return newValue;
  }

  async delete(id: number, userId: number) {
    const watcher = await super.delete(id, userId);

    await Queue.remove('Watcher', watcher.delay * 1000, watcher.id);

    return watcher;
  }

  async changeStatus(watcher: Watcher) {
    await Promise.all(
      watcher.notifications.map(async (notification) => {
        if (notification.active === true) {
          await Queue.add(`${notification.platform}_NOTIFICATION`, {
            watcher,
            notification,
          });
        }
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
