import { Router } from 'express';

import SessionController from '../../../controllers/SessionController';

const routes = new Router();

routes.post('/', SessionController.store);

export default new Router().use('/sessions', routes);
