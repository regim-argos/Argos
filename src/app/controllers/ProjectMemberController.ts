import { Request, Response, NextFunction } from 'express';
import IntergerParamsValidator from '@app/utils/IntergerParamsValidator';
import ProjectServices from '../Services/ProjectService';

class ProjectController {
  @IntergerParamsValidator('projectId')
  async store(req: Request, res: Response, next: NextFunction) {
    const { body, userId, params } = req;
    const projectId = parseInt(params.projectId, 10);

    const reponse = await ProjectServices.addMember(body, userId, projectId);
    return res.status(201).json(reponse);
  }

  @IntergerParamsValidator('projectId')
  async delete(req: Request, res: Response, next: NextFunction) {
    const { body, userId, params } = req;

    const projectId = parseInt(params.projectId, 10);

    const reponse = await ProjectServices.removeMember(body, userId, projectId);
    return res.status(200).json(reponse);
  }
}

export default new ProjectController();
