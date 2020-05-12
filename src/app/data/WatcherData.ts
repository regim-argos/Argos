import WatcherCache from './cache/WatcherCache';
import Watcher from './models/Watcher';
import Data from './Data';

class WatcherData extends Data<Watcher> {
  protected model = Watcher;

  protected cache = WatcherCache;
}

export default new WatcherData();
