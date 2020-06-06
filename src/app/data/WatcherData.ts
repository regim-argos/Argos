import WatcherCache from './cache/WatcherCache';
import Watcher from './models/Watcher';
import Data from './Data';

class WatcherData extends Data<Watcher> {
  protected model = Watcher;

  protected cache = WatcherCache;

  async getByIdWithEvent(
    id: number,
    user_id: number,
    month?: number,
    year?: number
  ) {
    return this.model.getByIdWithEvent(id, user_id, month, year);
  }
}

export default new WatcherData();
