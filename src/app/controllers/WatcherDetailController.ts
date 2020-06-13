import { Request, Response, NextFunction } from 'express';
import IntergerParamsValidator from '@app/utils/IntergerParamsValidator';
import WatcherService from '../Services/WatcherService';

class WatcherController {
  protected service = WatcherService;

  @IntergerParamsValidator('projectId')
  @IntergerParamsValidator('id')
  async show(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    req: Request<any, any, any, { month: number; year: number }>,
    res: Response,
    next: NextFunction
  ) {
    const { userId, params, query } = req;

    const id = parseInt(params.id, 10);
    const projectId = parseInt(params.projectId, 10);

    const item = await this.service.getByIdWithEvent(
      id,
      userId,
      projectId,
      query
    );

    return res.status(200).json(item);
  }
}

export default new WatcherController();
