import { Router } from 'express';

import UserController from '../../../controllers/UserController';

const routes = Router();

routes.put('/users', UserController.update);

export default routes;
