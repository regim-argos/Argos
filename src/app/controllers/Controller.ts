import { Request, Response, NextFunction } from 'express';
import IntergerParamsValidator from '@app/utils/IntergerParamsValidator';
import Service from '../Services/IService';

export default class Controller {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected service!: Service<any>;

  @IntergerParamsValidator('projectId')
  async index(req: Request, res: Response, next: NextFunction) {
    const { userId, params } = req;

    const projectId = parseInt(params.projectId, 10);

    const items = await this.service.getAllByProjectId(userId, projectId);
    return res.status(200).json(items);
  }

  @IntergerParamsValidator('projectId')
  async show(req: Request, res: Response, next: NextFunction) {
    const { userId, params } = req;

    const id = parseInt(params.id, 10);

    const projectId = parseInt(params.projectId, 10);

    const item = await this.service.verifyAndGet(id, userId, projectId);

    return res.status(200).json(item);
  }

  @IntergerParamsValidator('projectId')
  async store(req: Request, res: Response, next: NextFunction) {
    const { userId, params } = req;

    const projectId = parseInt(params.projectId, 10);

    const item = await this.service.create(req.body, userId, projectId);

    return res.status(201).json(item);
  }

  @IntergerParamsValidator('projectId')
  @IntergerParamsValidator('id')
  async update(req: Request, res: Response, next: NextFunction) {
    const { userId, params } = req;

    const id = parseInt(params.id, 10);

    const projectId = parseInt(params.projectId, 10);

    const item = await this.service.update(req.body, id, userId, projectId);

    return res.status(200).json(item);
  }

  @IntergerParamsValidator('projectId')
  @IntergerParamsValidator('id')
  async delete(req: Request, res: Response, next: NextFunction) {
    const { userId, params } = req;

    const id = parseInt(params.id, 10);

    const projectId = parseInt(params.projectId, 10);

    await this.service.delete(id, userId, projectId);

    return res.status(204).json();
  }
}
