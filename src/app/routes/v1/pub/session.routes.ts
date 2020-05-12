import { Router } from 'express';

import SessionController from '../../../controllers/SessionController';

const routes = Router();

routes.post('/', SessionController.store);

export default Router().use('/sessions', routes);
