import { Request, Response, NextFunction } from 'express';
import Service from '../Services/IService';

export default class Controller {
  protected service!: Service<any>;

  async index(req: Request, res: Response, next: NextFunction) {
    const { userId, params } = req;

    const projectId = parseInt(params.projectId, 10);

    if (!projectId)
      return res.status(400).json({ message: 'Invalid PorjectId' });

    const items = await this.service.getAllByProjectId(userId, projectId);
    return res.status(200).json(items);
  }

  async show(req: Request, res: Response, next: NextFunction) {
    const { userId, params } = req;

    const id = parseInt(params.id, 10);

    if (!id) return res.status(400).json({ message: 'Invalid ID' });

    const projectId = parseInt(params.projectId, 10);

    if (!projectId)
      return res.status(400).json({ message: 'Invalid PorjectId' });

    const item = await this.service.verifyAndGet(id, userId, projectId);

    return res.status(200).json(item);
  }

  async store(req: Request, res: Response, next: NextFunction) {
    const { userId, params } = req;
    const projectId = parseInt(params.projectId, 10);

    if (!projectId)
      return res.status(400).json({ message: 'Invalid PorjectId' });

    const item = await this.service.create(req.body, userId, projectId);

    return res.status(201).json(item);
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const { userId, params } = req;

    const id = parseInt(params.id, 10);

    if (!id) return res.status(400).json({ message: 'Invalid ID' });

    const projectId = parseInt(params.projectId, 10);

    if (!projectId)
      return res.status(400).json({ message: 'Invalid PorjectId' });

    const item = await this.service.update(req.body, id, userId, projectId);

    return res.status(200).json(item);
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const { userId, params } = req;

    const id = parseInt(params.id, 10);

    if (!id) return res.status(400).json({ message: 'Invalid ID' });

    const projectId = parseInt(params.projectId, 10);

    if (!projectId)
      return res.status(400).json({ message: 'Invalid PorjectId' });

    await this.service.delete(id, userId, projectId);

    return res.status(204).json();
  }
}
