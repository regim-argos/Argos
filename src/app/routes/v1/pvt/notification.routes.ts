import { Router } from 'express';

import NotificationController from '../../../controllers/NotificationController';

const routes = Router();

routes.get('/:projectId/notifications/', (req, res, next) =>
  NotificationController.index(req, res, next)
);
routes.get('/:projectId/notifications/:id', (req, res, next) =>
  NotificationController.show(req, res, next)
);
routes.post('/:projectId/notifications/', (req, res, next) =>
  NotificationController.store(req, res, next)
);
routes.put('/:projectId/notifications/:id', (req, res, next) =>
  NotificationController.update(req, res, next)
);
routes.delete('/:projectId/notifications/:id', (req, res, next) =>
  NotificationController.delete(req, res, next)
);

export default Router().use(routes);
