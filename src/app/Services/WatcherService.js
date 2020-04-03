import WatcherValidator from '../Validators/WatcherValidator';
import NotFoundError from '../Error/NotFoundError';
import Watcher from '../models/Watcher';
import Queue from '../../lib/Queue';

class WatcherServices {
  constructor() {
    this.model = Watcher;
  }

  async getUserWatchers(userId, page, search) {
    return this.model.getUserWatchers(userId, search);
  }

  async verifyAndGetWatcher(id, userId) {
    const watcher = await this.model.getWatcherById(id, userId);
    if (!watcher) throw new NotFoundError('Watcher');
    return watcher;
  }

  async create(data, userId) {
    const ValidatedWatcher = await WatcherValidator.createValidator(data);

    const watcher = await this.model.createWatcher(ValidatedWatcher, userId);
    await Queue.add('Watcher', watcher, { every: 10000 });
    return watcher;
  }

  async update(data, id, userId) {
    const ValidatedWatcher = await WatcherValidator.updateValidator(data);

    const dbWatcher = await this.verifyAndGetWatcher(id, userId);
    const updatedWatcher = await this.model.updateWatcherById(
      ValidatedWatcher,
      id,
      userId
    );
    if (ValidatedWatcher.active !== dbWatcher.active) {
      if (ValidatedWatcher.active === true) {
        await Queue.add('Watcher', updatedWatcher, { every: 10000 });
      } else {
        await Queue.remove('Watcher', 10000, updatedWatcher.id);
      }
    }
    return updatedWatcher;
  }

  async delete(id, userId) {
    const watcher = await this.verifyAndGetWatcher(id);
    await this.model.deleteWatcherById(id, userId);
    return watcher;
  }
}

export default new WatcherServices();
