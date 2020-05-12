import { Router } from 'express';

import NotificationController from '../../../controllers/NotificationController';

const routes = Router();

routes.get('/', (req, res, next) =>
  NotificationController.index(req, res, next)
);
routes.get('/:id', (req, res, next) =>
  NotificationController.show(req, res, next)
);
routes.post('/', (req, res, next) =>
  NotificationController.store(req, res, next)
);
routes.put('/:id', (req, res, next) =>
  NotificationController.update(req, res, next)
);
routes.delete('/:id', (req, res, next) =>
  NotificationController.delete(req, res, next)
);

export default Router().use('/notifications', routes);
