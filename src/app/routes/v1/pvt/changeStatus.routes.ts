import { Router } from 'express';

import ChangeStatusController from '../../../controllers/ChangeStatusController';
import adminRoutes from '../../../middlewares/adminRoutes';

const routes = new Router();

routes.put('/:id', (req, res, next) =>
  ChangeStatusController.update(req, res, next)
);

export default new Router().use('/change_status', adminRoutes, routes);
