import WatcherCache from './cache/WatcherCache';
import Watcher from './models/Watcher';
import Data from './Data';

class WatcherData extends Data {
  constructor() {
    super(Watcher, WatcherCache);
  }
}

export default new WatcherData();
