import { Router } from 'express';

import ConfirmEmailController from '../../../controllers/ConfirmEmailController';

const routes = new Router();

routes.post('/', ConfirmEmailController.store);
routes.put('/:hash', ConfirmEmailController.update);

export default new Router().use('/confirmEmail', routes);
