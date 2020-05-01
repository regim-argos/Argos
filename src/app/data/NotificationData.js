import NotificationCache from './cache/NotificationCache';
import Notification from './models/Notification';
import Data from './Data';

class NotificationData extends Data {
  constructor() {
    super(Notification, NotificationCache);
  }

  async getAllByIds(ids, userId) {
    return this.model.getAllByIds(ids, userId);
  }
}

export default new NotificationData();
