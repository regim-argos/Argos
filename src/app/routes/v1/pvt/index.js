import { Router } from 'express';

import testpvt from './testpvt.routes';
import userRoutes from './user.routes';
import files from './files.routes';

const routes = new Router();

routes.use(testpvt);
routes.use(userRoutes);
routes.use(files);

export default routes;
