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
routes.delete('/:id', (req, res, next) =>
  WatcherController.delete(req, res, next)
);

export default Router().use(routes);
