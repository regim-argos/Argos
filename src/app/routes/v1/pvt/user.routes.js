import { Router } from 'express';

import UserController from '../../../controllers/UserController';

const routes = new Router();

routes.put('/users', UserController.update);

export default routes;
