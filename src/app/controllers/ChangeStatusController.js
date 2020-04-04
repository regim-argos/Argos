import WatcherService from '../Services/WatcherService';

class ChangeStatusController {
  async update(req, res, next) {
    const {
      userId: user_id,
      params: { id },
    } = req;

    await WatcherService.changeStatus(req.body.status, id, user_id);

    res.status(204).json();
    return next();
  }
}

export default new ChangeStatusController();
