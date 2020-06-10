import NotFoundError from '@app/Error/NotFoundError';
import { verifyIsProjectMember } from '@app/utils/ProjectDecorators';
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

  @verifyIsProjectMember(1, 2)
  async create(data: object, userId: number, projectId: number) {
    const validated = await this.validator.createValidator<Notification>(data);

    const notification = await this.model.create(validated, projectId);

    return notification;
  }

  @verifyIsProjectMember(2, 3)
  async update(data: object, id: number, userId: number, projectId: number) {
    const validated = await this.validator.updateValidator<Notification>(data);

    await this.verifyAndGetWithAuth(id, projectId);

    const newValue = await this.model.updateById(validated, id, projectId);

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
