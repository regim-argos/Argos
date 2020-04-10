import Service from './Service';
import Notification from '../models/Notification';
import NotificationValidator from '../Validators/NotificationValidator';

class NotificationService extends Service {
  constructor() {
    super('Notification', Notification, NotificationValidator);
  }

  getAllByIds(ids) {
    return this.model.getAllByIds(ids);
  }
}

export default new NotificationService();
