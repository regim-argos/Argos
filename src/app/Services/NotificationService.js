import Service from './Service';
import Notification from '../models/Notification';
import NotificationValidator from '../Validators/NotificationValidator';

class NotificationService extends Service {
  constructor() {
    super('Notification', Notification, NotificationValidator);
  }

  getAllByWatcherId(watcherId) {
    return this.model.getAllByWatcherId(watcherId);
  }
}

export default new NotificationService();
