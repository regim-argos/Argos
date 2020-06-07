import { Request, Response, NextFunction } from 'express';
import Service from '../Services/Service';

export default class Controller {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected service!: Service<any>;

  async index(req: Request, res: Response, next: NextFunction) {
    const { userId } = req;

    const items = await this.service.getAllByUserId(userId);
    return res.status(200).json(items);
  }

  async show(req: Request, res: Response, next: NextFunction) {
    const { userId, params } = req;

    const id = parseInt(params.id, 10);

    if (!id) return res.status(400).json({ message: 'Invalid ID' });

    const item = await this.service.verifyAndGet(id, userId);

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

    const item = await this.service.update(req.body, id, userId);

    return res.status(200).json(item);
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const { userId, params } = req;

    const id = parseInt(params.id, 10);

    if (!id) return res.status(400).json({ message: 'Invalid ID' });

    await this.service.delete(id, userId);

    return res.status(204).json();
  }
}
