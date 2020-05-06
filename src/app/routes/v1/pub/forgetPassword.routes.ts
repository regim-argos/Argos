import { Router } from 'express';

import forgetPasswordContoller from '../../../controllers/forgetPasswordContoller';

const routes = new Router();

routes.post('/', forgetPasswordContoller.store);
routes.put('/:hash', forgetPasswordContoller.update);

export default new Router().use('/forgetPassword', routes);
