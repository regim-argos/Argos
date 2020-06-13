import NotificationCache from './cache/NotificationCache';
import Notification from './models/Notification';
import Data from './Data';

class NotificationData extends Data<Notification> {
  protected model = Notification;

  protected cache = NotificationCache;

  async getAllByIds(ids: number[], projectId: number) {
    return this.model.getAllByIds(ids, projectId);
  }
}

export default new NotificationData();
