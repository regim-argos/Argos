import { Router } from 'express';

import WatcherDetailController from '../../../controllers/WatcherDetailController';

const routes = Router();

routes.get('/:id', (req, res, next) =>
  WatcherDetailController.show(req, res, next)
);

export default Router().use('/watchersDetail', routes);
