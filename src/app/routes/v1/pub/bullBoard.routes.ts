import { UI } from 'bull-board';

import { Router } from 'express';

const routes = Router();

routes.use('/admin/queues', UI);

export default routes;
