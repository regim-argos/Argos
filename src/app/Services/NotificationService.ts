import NotFoundError from '@app/Error/NotFoundError';
import { verifyIsProjectMember } from '@app/utils/ProjectDecorators';
import ValidateDecorator from '@app/utils/ValidateDecorator';
import IService from './IService';
import NotificationValidator from '../Validators/NotificationValidator';
import BadRequestError from '../Error/BadRequestError';
import NotificationData from '../data/NotificationData';
import Notification from '../data/models/Notification';

class NotificationService extends IService<Notification> {
  public name = 'Notification';

  protected model = NotificationData;

  public validator = NotificationValidator;

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
  @verifyIsProjectMember(1, 2)
  async create(data: Notification, userId: number, projectId: number) {
    const notification = await this.model.create(data, projectId);

    return notification;
  }

  @ValidateDecorator(0, 'updateValidator')
  @verifyIsProjectMember(2, 3)
  async update(
    data: Notification,
    id: number,
    userId: number,
    projectId: number
  ) {
    await this.verifyAndGetWithAuth(id, projectId);

    const newValue = await this.model.updateById(data, id, projectId);

    return newValue;
  }

  @verifyIsProjectMember(1, 2)
  async delete(id: number, userId: number, projectId: number) {
    const notification = await this.verifyAndGetWithAuth(id, projectId);
    await this.model.deleteById(id, projectId);

    return notification;
  }

  async getAllByIds(ids: number[] = [], projectId: number) {
    const notifications = await this.model.getAllByIds(ids, projectId);
    if (ids.length !== notifications.length)
      throw new BadRequestError('Notification(s) not found');
    return notifications;
  }
}

export default new NotificationService();
