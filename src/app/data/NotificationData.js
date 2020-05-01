import NotificationCache from './cache/NotificationCache';
import Notification from './models/Notification';
import Data from './Data';

class NotificationData extends Data {
  constructor() {
    super(Notification, NotificationCache);
  }
}

export default new NotificationData();
