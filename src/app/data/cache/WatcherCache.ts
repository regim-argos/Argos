import Cache from './Cache';

class WatcherCache extends Cache {
  get keyPrefix() {
    return 'watchers';
  }
}

export default new WatcherCache();
