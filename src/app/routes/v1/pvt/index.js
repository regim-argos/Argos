import { Router } from 'express';

import testpvt from './testpvt.routes';
import userRoutes from './user.routes';
import files from './files.routes';
import watcherRoutes from './watcher.routes';
import changeStatusRoutes from './changeStatus.routes';

const routes = new Router();

routes.use(testpvt);
routes.use(userRoutes);
routes.use(watcherRoutes);
routes.use(changeStatusRoutes);
routes.use(files);

export default routes;
