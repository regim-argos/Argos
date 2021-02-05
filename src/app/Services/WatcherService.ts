/* eslint-disable import/no-cycle */
import NotFoundError from '@app/Error/NotFoundError';
import { verifyIsProjectMember } from '@app/utils/ProjectDecorators';
import ValidateDecorator from '@app/utils/ValidateDecorator';
import WatcherToNotification from '@app/utils/IWatcherToNotification';
import Event from '@app/data/models/Event';
import Rabbit from '@lib/Rabbit';
import { v4 } from 'uuid';
import WatcherValidator from '../Validators/WatcherValidator';
import Queue from '../../lib/Queue';
import BadRequestError from '../Error/BadRequestError';
import NotificationService from './NotificationService';
import WatcherData from '../data/WatcherData';
import Watcher from '../data/models/Watcher';
import ProjectService from './ProjectService';
import IService from './IService';

class WatcherService extends IService<Watcher> {
  public name = 'Watcher';

  protected model = WatcherData;

  public validator = WatcherValidator;

  @verifyIsProjectMember(0, 1)
  async getAllByProjectId(userId: number, projectId: number) {
    return this.model.getAllByProjectId(projectId);
  }

  @verifyIsProjectMember(1, 2)
  async verifyAndGet(id: number, userId: number, projectId: number) {
    const item = await this.model.getById(id, projectId);
    if (!item) throw new NotFoundError(this.name);
    return item;
  }

  protected async verifyAndGetWithAuth(id: number, projectId: number) {
    const item = await this.model.getById(id, projectId);
    if (!item) throw new NotFoundError(this.name);
    return item;
  }

  @ValidateDecorator(0, 'createValidator')
  async create(data: Watcher, userId: number, projectId: number) {
    const project = await ProjectService.verifyIsProjectMember(
      userId,
      projectId
    );

    if (data.notifications?.length)
      await NotificationService.getAllByIds(
        data.notifications.map((item) => item.id),
        projectId
      );
    if (data.delay < project.defaultDelay)
      throw new BadRequestError(
        `Watcher time can't be less than ${project.defaultDelay} seconds`
      );
    const watchers = await this.model.getAllByProjectId(projectId);
    if (project.watcherNumber <= watchers.length)
      throw new BadRequestError(
        `Can't add another watcher, max number is ${project.watcherNumber}. Want more? upgrade your plan`
      );

    const watcher = await this.model.create(
      { ...data, currentWatcherId: v4() } as Watcher,
      projectId
    );

    if (watcher.active) await Rabbit.sendMessage('watcher', watcher, true);

    return watcher;
  }

  @ValidateDecorator(0, 'updateValidator')
  async update(data: Watcher, id: number, userId: number, projectId: number) {
    const project = await ProjectService.verifyIsProjectMember(
      userId,
      projectId
    );
    if (data.notifications?.length)
      await NotificationService.getAllByIds(
        data.notifications.map((item) => item.id),
        projectId
      );
    if (data.delay < project.defaultDelay)
      throw new BadRequestError(
        `Watcher time can't be less than ${project.defaultDelay} seconds`
      );
    await this.verifyAndGetWithAuth(id, projectId);

    const newValue = await this.model.updateById(
      { ...data, currentWatcherId: v4() },
      id,
      projectId
    );

    await Rabbit.sendMessage('watcher', newValue, true);

    return newValue;
  }

  @verifyIsProjectMember(1, 2)
  async delete(id: number, userId: number, projectId: number) {
    const watcher = await this.verifyAndGetWithAuth(id, projectId);
    await this.model.deleteById(id, projectId);

    await Queue.remove('Watcher', watcher.delay * 1000, watcher.id);

    return watcher;
  }

  @verifyIsProjectMember(1, 2)
  @ValidateDecorator(3, 'watcherDetailValidator')
  async getByIdWithEvent(
    id: number,
    userId: number,
    projectId: number,
    { month, year }: { month: number; year: number }
  ) {
    return this.model.getByIdWithEvent(id, projectId, month, year);
  }

  async changeStatusNotifications(
    id: number,
    projectId: number,
    status: boolean,
    lastChange: string
  ) {
    const watcher = (await this.verifyAndGetWithAuth(
      id,
      projectId
    )) as WatcherToNotification;
    await this.model.updateById({ status, lastChange }, id, projectId);
    await Event.createOne(id, status, new Date(lastChange));
    watcher.oldLastChange = watcher.lastChange;
    await Promise.all(
      watcher.notifications.map(async (notification) => {
        if (notification.active === true) {
          await Rabbit.sendMessage(
            `${notification.platform}_NOTIFICATION`.toLowerCase(),
            {
              watcher,
              notification,
            },
            true
          );
        }
      })
    );
  }
}

export default new WatcherService();
