import { Router } from 'express';

import ProjectMemberController from '@app/controllers/ProjectMemberController';
import ProjectController from '../../../controllers/ProjectController';

const routes = Router();

routes.get('/projects', ProjectController.index);

routes.get('/projects/:id', ProjectController.show);

routes.post('/projects', ProjectController.store);

routes.post('/:projectId/projectMember', ProjectMemberController.store);
routes.delete('/:projectId/projectMember', ProjectMemberController.delete);

export default routes;
