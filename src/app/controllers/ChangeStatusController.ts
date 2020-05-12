import { Request, Response, NextFunction } from 'express';
import WatcherService from '../Services/WatcherService';

class ChangeStatusController {
  async update(req: Request, res: Response, next: NextFunction) {
    await WatcherService.changeStatus(req.body);

    return res.status(204).json();
  }
}

export default new ChangeStatusController();
