import { Request, Response, NextFunction } from 'express';
import ProjectServices from '../Services/ProjectService';

class ProjectController {
  async store(req: Request, res: Response, next: NextFunction) {
    const { body, userId, params } = req;
    const projectId = parseInt(params.projectId, 10);

    if (!projectId)
      return res.status(400).json({ message: 'Invalid PorjectId' });

    const reponse = await ProjectServices.addMember(body, userId, projectId);
    return res.status(201).json(reponse);
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const { body, userId, params } = req;

    const projectId = parseInt(params.projectId, 10);

    if (!projectId)
      return res.status(400).json({ message: 'Invalid PorjectId' });

    const reponse = await ProjectServices.removeMember(body, userId, projectId);
    return res.status(200).json(reponse);
  }
}

export default new ProjectController();
