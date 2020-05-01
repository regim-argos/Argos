import Service from './Service';
import Notification from '../data/models/Notification';
import NotificationValidator from '../Validators/NotificationValidator';
import BadRequestError from '../Error/BadRequestError';

class NotificationService extends Service {
  constructor() {
    super('Notification', Notification, NotificationValidator);
  }

  async getAllByIds(ids = [], userId) {
    const notifications = await this.model.getAllByIds(ids, userId);
    if (ids.length !== notifications.length)
      throw new BadRequestError('Notification(s) not found');
    return notifications;
  }
}

export default new NotificationService();
