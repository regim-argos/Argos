import { Request, Response, NextFunction } from 'express';
import ProjectServices from '../Services/ProjectService';

class ProjectController {
  async store(req: Request, res: Response, next: NextFunction) {
    const { id, name, members } = await ProjectServices.create(
      req.body,
      req.userId
    );
    return res.status(201).json({
      id,
      name,
      members,
    });
  }
}

export default new ProjectController();
