import NotFoundError from '@app/Error/NotFoundError';
import IService from './IService';
import NotificationValidator from '../Validators/NotificationValidator';
import BadRequestError from '../Error/BadRequestError';
import NotificationData from '../data/NotificationData';
import Notification from '../data/models/Notification';
import ProjectService from './ProjectService';

class NotificationService extends IService<Notification> {
  public name = 'Notification';

  protected model = NotificationData;

  public validator = NotificationValidator;

  async getAllByProjectId(userId: number, projectId: number) {
    await ProjectService.verifyIsProjectMember(userId, projectId);
    return this.model.getAllByProjectId(projectId);
  }

  async verifyAndGet(id: number, userId: number, projectId: number) {
    await ProjectService.verifyIsProjectMember(userId, projectId);
    const item = await this.model.getById(id, projectId);
    if (!item) throw new NotFoundError(this.name);
    return item;
  }

  protected async verifyAndGetWithAuth(id: number, projectId: number) {
    const item = await this.model.getById(id, projectId);
    if (!item) throw new NotFoundError(this.name);
    return item;
  }

  async create(data: object, userId: number, projectId: number) {
    const validated = await this.validator.createValidator<Notification>(data);
    await ProjectService.verifyIsProjectMember(userId, projectId);

    const notification = await this.model.create(validated, projectId);

    return notification;
  }

  async update(data: object, id: number, userId: number, projectId: number) {
    const validated = await this.validator.updateValidator<Notification>(data);
    await ProjectService.verifyIsProjectMember(userId, projectId);

    await this.verifyAndGetWithAuth(id, projectId);

    const newValue = await this.model.updateById(validated, id, projectId);

    return newValue;
  }

  async delete(id: number, userId: number, projectId: number) {
    await ProjectService.verifyIsProjectMember(userId, projectId);
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
