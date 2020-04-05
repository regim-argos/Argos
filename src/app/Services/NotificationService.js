import Service from './Service';
import Notification from '../models/Notification';
import NotificationValidator from '../Validators/NotificationValidator';
// eslint-disable-next-line import/no-cycle
import WatcherService from './WatcherService';

class NotificationService extends Service {
  constructor() {
    super('Notification', Notification, NotificationValidator);
  }

  getAllByWatcherId(watcherId) {
    return this.model.getAllByWatcherId(watcherId);
  }

  async dbValidatorCreate(validated, userId) {
    await WatcherService.verifyAndGet(validated.watcherId, userId);
  }
}

export default new NotificationService();
