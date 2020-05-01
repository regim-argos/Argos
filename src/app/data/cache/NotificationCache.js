import Cache from './Cache';
import WatcherCache from './WatcherCache';

class NotificationCache extends Cache {
  get keyPrefix() {
    return 'notifications';
  }

  invalidateUpdateKeys(userId, id) {
    return [
      ...super.invalidateUpdateKeys(userId, id),
      { key: `${WatcherCache.getKey(userId)}`, type: 'MANY' },
    ];
  }
}

export default new NotificationCache();
