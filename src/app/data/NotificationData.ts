import NotificationCache from './cache/NotificationCache';
import Notification from './models/Notification';
import Data from './Data';

class NotificationData extends Data<Notification> {
  protected model = Notification;

  protected cache = NotificationCache;

  async getAllByIds(ids: number[], userId: number) {
    return this.model.getAllByIds(ids, userId);
  }
}

export default new NotificationData();
