import WatcherValidator from '../Validators/WatcherValidator';
import Watcher from '../models/Watcher';
import Queue from '../../lib/Queue';
import Service from './Service';

class WatcherServices extends Service {
  constructor() {
    super('Watcher', Watcher, WatcherValidator);
  }

  async create(data, userId) {
    const watcher = await super.create(data, userId);

    if (watcher.active)
      await Queue.addRepeatJob('Watcher', watcher, {
        every: watcher.delay * 1000,
      });

    return watcher;
  }

  async update(data, id, userId) {
    const { old, newValue } = await super.update(data, id, userId);

    await Queue.remove('Watcher', old.delay * 1000, old.id);
    if (newValue.active)
      await Queue.addRepeatJob('Watcher', newValue, {
        every: newValue.delay * 1000,
      });

    return newValue;
  }

  async delete(id, userId) {
    const watcher = await super.delete(id, userId);

    await Queue.remove('Watcher', watcher.delay * 1000, watcher.id);

    return watcher;
  }

  async changeStatus(status, id, userId) {
    await this.verifyAndGet(id, userId, 'ADMIN');

    await this.model.ChangeWatcherStatusById({ status }, id);
  }
}

export default new WatcherServices();
