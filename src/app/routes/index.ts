import { Router } from 'express';

import v1Routes from './v1';

const routes = new Router();

routes.use('/v1', v1Routes);

export default routes;
