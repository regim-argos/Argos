import { Router, Request } from 'express';

import WatcherDetailController from '../../../controllers/WatcherDetailController';

const routes = Router();

routes.get(
  '/:projectId/watchersDetail/:id',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (req: Request<any, any, any, { month: number; year: number }>, res, next) =>
    WatcherDetailController.show(req, res, next)
);

export default routes;
