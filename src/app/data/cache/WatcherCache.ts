import Cache from './Cache';

class WatcherCache extends Cache {
  protected keyPrefix = 'watchers';
}

export default new WatcherCache();
