import { Request, Response, NextFunction } from 'express';
import WatcherService from '../Services/WatcherService';

class WatcherController {
  protected service = WatcherService;

  async show(req: Request, res: Response, next: NextFunction) {
    const { userId, params, query } = req;

    const id = parseInt(params.id, 10);

    let month;
    let year;

    if (!id) return res.status(400).json({ message: 'Invalid ID' });
    if (query.month) {
      month = parseInt(query.month as string, 10);

      if (!month && month <= 12 && month >= 1)
        return res.status(400).json({ message: 'Invalid Month' });
    }

    if (query.year) {
      year = parseInt(query.year as string, 10);

      if (!year) return res.status(400).json({ message: 'Invalid Year' });
    }

    const item = await this.service.getByIdWithEvent(id, userId, month, year);

    return res.status(200).json(item);
  }
}

export default new WatcherController();
