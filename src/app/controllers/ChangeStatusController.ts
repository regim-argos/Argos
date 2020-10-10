import { Request, Response, NextFunction } from 'express';
import IntergerParamsValidator from '@app/utils/IntergerParamsValidator';
import WatcherService from '../Services/WatcherService';

class ChangeStatusController {
  protected service = WatcherService;

  @IntergerParamsValidator('projectId')
  @IntergerParamsValidator('id')
  async update(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { params } = req;

    const id = parseInt(params.id, 10);
    const projectId = parseInt(params.projectId, 10);

    const item = await this.service.changeStatusNotifications(
      id,
      projectId,
      req.body.status,
      req.body.lastChange,
    );

    return res.status(200).json(item);
  }
}

export default new ChangeStatusController();
