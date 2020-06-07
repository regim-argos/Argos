/* eslint-disable import/no-cycle */
import WatcherValidator from '../Validators/WatcherValidator';
import Queue from '../../lib/Queue';
import UserServices from './UserServices';
import BadRequestError from '../Error/BadRequestError';
import NotificationService from './NotificationService';
import WatcherData from '../data/WatcherData';
import Watcher from '../data/models/Watcher';
import ProjectService from './ProjectService';

class WatcherService {
  public name = 'Watcher';

  protected model = WatcherData;

  public validator = WatcherValidator;

  // async getAllByProjectId(ProjectId: number) {
  //   return this.model.getAllByProjectId(ProjectId);
  // }

  async create(data: object, userId: number, projectId: number) {
    const validated = await this.validator.createValidator<Watcher>(data);
    const project = await ProjectService.verifyIsProjectMember(
      userId,
      projectId
    );

    if (validated.notifications?.length)
      await NotificationService.getAllByIds(
        validated.notifications.map((item) => item.id),
        userId
      );
    if (validated.delay < project.defaultDelay)
      throw new BadRequestError(
        `Watcher time can't be less than ${project.defaultDelay} seconds`
      );
    const watchers = await this.model.getAllByProjectId(projectId);
    if (project.watcherNumber <= watchers.length)
      throw new BadRequestError(
        `Can't add another watcher, max number is ${project.watcherNumber}. Want more? upgrade your plan`
      );

    const watcher = await this.model.create(validated, projectId);

    if (watcher.active)
      await Queue.addRepeatJob('Watcher', watcher, {
        every: watcher.delay * 1000,
      });

    return watcher;
  }

  async getByIdWithEvent(
    id: number,
    user_id: number,
    month?: number,
    year?: number
  ) {
    return this.model.getByIdWithEvent(id, user_id, month, year);
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

  // async update(data: object, id: number, userId: number) {
  //   const { old, newValue } = await super.updateWithReturn(data, id, userId);

  //   await Queue.remove('Watcher', old.delay * 1000, old.id);
  //   if (newValue.active)
  //     await Queue.addRepeatJob('Watcher', newValue, {
  //       every: newValue.delay * 1000,
  //     });

  //   return newValue;
  // }

  // async delete(id: number, userId: number) {
  //   const watcher = await super.delete(id, userId);

  //   await Queue.remove('Watcher', watcher.delay * 1000, watcher.id);

  //   return watcher;
  // }

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
    // await app.socketIo.sendNotification(
    //   watcher.user_id,
    //   'ChangeStatus',
    //   watcher
    // );
  }
}

export default new WatcherService();
