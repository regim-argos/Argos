import { Request, Response, NextFunction } from 'express';
import ProjectServices from '../Services/ProjectService';

class ProjectController {
  async store(req: Request, res: Response, next: NextFunction) {
    const { id, name } = await ProjectServices.create(req.body);
    return res.status(201).json({
      id,
      name,
    });
  }
}

export default new ProjectController();
