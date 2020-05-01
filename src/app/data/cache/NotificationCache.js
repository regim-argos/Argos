import Cache from './Cache';

class NotificationCache extends Cache {
  get keyPrefix() {
    return 'notifications';
  }
}

export default new NotificationCache();
