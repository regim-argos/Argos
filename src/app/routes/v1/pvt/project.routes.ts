import { Router } from 'express';

import ProjectController from '../../../controllers/ProjectController';

const routes = Router();

routes.get('/projects', ProjectController.index);

routes.post('/projects', ProjectController.store);

export default routes;
