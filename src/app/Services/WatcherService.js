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

  async verifyAndGetWatcher(id, userId, role) {
    const watcher = await this.model.getWatcherById(
      id,
      role === 'ADMIN' ? undefined : userId
    );
    if (!watcher) throw new NotFoundError('Watcher');
    return watcher;
  }

  async create(data, userId) {
    const ValidatedWatcher = await WatcherValidator.createValidator(data);

    const watcher = await this.model.createWatcher(ValidatedWatcher, userId);
    if (watcher.active)
      await Queue.addRepeatJob('Watcher', watcher, {
        every: watcher.delay * 1000,
      });

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
    await Queue.remove('Watcher', dbWatcher.delay * 1000, dbWatcher.id);
    if (updatedWatcher.active)
      await Queue.addRepeatJob('Watcher', updatedWatcher, {
        every: updatedWatcher.delay * 1000,
      });
    return updatedWatcher;
  }

  async delete(id, userId) {
    const watcher = await this.verifyAndGetWatcher(id, userId);
    await this.model.deleteWatcherById(id, userId);
    await Queue.remove('Watcher', watcher.delay * 1000, watcher.id);
    return watcher;
  }

  async changeStatus(status, id, userId) {
    await this.verifyAndGetWatcher(id, userId, 'ADMIN');

    await this.model.ChangeWatcherStatusById({ status }, id);
  }
}

export default new WatcherServices();
