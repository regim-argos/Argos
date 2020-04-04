import WatcherService from '../Services/WatcherService';

class WatcherController {
  async index(req, res, next) {
    const { userId } = req;
    const { page, search } = req.query;

    const watchers = await WatcherService.getUserWatchers(userId, page, search);

    req.response = watchers;
    res.status(200).json(watchers);
    return next();
  }

  async show(req, res, next) {
    const {
      userId,
      userRole,
      params: { id },
    } = req;

    const watcher = await WatcherService.verifyAndGetWatcher(
      id,
      userId,
      userRole
    );

    req.response = watcher;
    res.status(200).json(watcher);
    return next();
  }

  async store(req, res, next) {
    const { userId } = req;

    const watcher = await WatcherService.create(req.body, userId);

    res.status(201).json(watcher);
    return next();
  }

  async update(req, res, next) {
    const {
      userId: user_id,
      params: { id },
    } = req;

    const watcher = await WatcherService.update(req.body, id, user_id);

    res.status(200).json(watcher);
    return next();
  }

  async delete(req, res, next) {
    const {
      userId,
      params: { id },
    } = req;

    await WatcherService.delete(id, userId);

    res.status(204).json();
    return next();
  }
}

export default new WatcherController();
