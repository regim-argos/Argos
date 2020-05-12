import Cache from './Cache';
import WatcherCache from './WatcherCache';

class NotificationCache extends Cache {
  protected keyPrefix = 'notifications';

  invalidateUpdateKeys(userId: number, id: number) {
    return [
      ...super.invalidateUpdateKeys(userId, id),
      { key: `${WatcherCache.getKey(userId)}`, type: 'MANY' },
    ];
  }
}

export default new NotificationCache();
