import { Router } from 'express';

import ConfirmEmailController from '../../../controllers/ConfirmEmailController';

const routes = Router();

routes.post('/', ConfirmEmailController.store);
routes.put('/:hash', ConfirmEmailController.update);

export default Router().use('/confirmEmail', routes);
