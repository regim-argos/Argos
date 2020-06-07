import { Router } from 'express';

import ProjectController from '../../../controllers/ProjectController';

const routes = Router();

routes.post('/projects', ProjectController.store);

export default routes;
