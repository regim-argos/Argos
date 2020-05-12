import { Router } from 'express';

import forgetPasswordContoller from '../../../controllers/forgetPasswordContoller';

const routes = Router();

routes.post('/', forgetPasswordContoller.store);
routes.put('/:hash', forgetPasswordContoller.update);

export default Router().use('/forgetPassword', routes);
