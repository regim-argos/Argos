import Watcher from './models/Watcher';
import Data from './Data';

class WatcherData extends Data<Watcher> {
  protected model = Watcher;
}

export default new WatcherData();
