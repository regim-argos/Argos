import { Router } from 'express';

import ProjectMemberController from '@app/controllers/ProjectMemberController';
import ProjectController from '../../../controllers/ProjectController';

const routes = Router();

routes.get('/projects', ProjectController.index);

routes.post('/projects', ProjectController.store);

routes.post('/:projectId/projectMember', ProjectMemberController.store);

export default routes;
