import WatcherService from '../Services/WatcherService';

class ChangeStatusController {
  async update(req, res, next) {
    const {
      userId: user_id,
      params: { id },
    } = req;

    await WatcherService.changeStatus(req.body, id, user_id);

    return res.status(204).json();
  }
}

export default new ChangeStatusController();
