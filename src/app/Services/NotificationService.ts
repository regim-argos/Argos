import Service from './Service';
import NotificationValidator from '../Validators/NotificationValidator';
import BadRequestError from '../Error/BadRequestError';
import NotificationData from '../data/NotificationData';
import Notification from '../data/models/Notification';

class NotificationService extends Service<Notification> {
  public name = 'Notification';

  protected model = NotificationData;

  public validator = NotificationValidator;

  async getAllByIds(ids: number[] = [], userId: number) {
    const notifications = await this.model.getAllByIds(ids, userId);
    if (ids.length !== notifications.length)
      throw new BadRequestError('Notification(s) not found');
    return notifications;
  }
}

export default new NotificationService();
