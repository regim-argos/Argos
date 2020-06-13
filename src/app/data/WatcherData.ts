import WatcherCache from './cache/WatcherCache';
import Watcher from './models/Watcher';
import Data from './Data';

class WatcherData extends Data<Watcher> {
  protected model = Watcher;

  protected cache = WatcherCache;

  async getByIdWithEvent(
    id: number,
    projectId: number,
    month?: number,
    year?: number
  ) {
    return this.model.getByIdWithEvent(id, projectId, month, year);
  }
}

export default new WatcherData();
