import { Router } from 'express';

import ChangeStatusController from '../../../controllers/ChangeStatusController';
import adminRoutes from '../../../middlewares/adminRoutes';

const routes = new Router();

routes.put('/:id', ChangeStatusController.update);

export default new Router().use('/change_status', adminRoutes, routes);
