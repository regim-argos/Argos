import ChangeStatusController from '@app/controllers/ChangeStatusController';
import adminAuth from '@app/middlewares/adminAuth';
import { Router } from 'express';

import WatcherController from '../../../controllers/WatcherController';

const routes = Router();

routes.get('/:projectId/watchers/', (req, res, next) =>
  WatcherController.index(req, res, next)
);
routes.get('/:projectId/watchers/:id', (req, res, next) =>
  WatcherController.show(req, res, next)
);
routes.post('/:projectId/watchers/', (req, res, next) =>
  WatcherController.store(req, res, next)
);
routes.put('/:projectId/watchers/:id', (req, res, next) =>
  WatcherController.update(req, res, next)
);
routes.delete('/:projectId/watchers/:id', (req, res, next) =>
  WatcherController.delete(req, res, next)
);
routes.put('/:projectId/changeStatus/:id', adminAuth,(req, res, next) =>
  ChangeStatusController.update(req, res, next)
);

export default routes;
