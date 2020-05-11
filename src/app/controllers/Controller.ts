import Service from '../Services/Service';

export default class Controller {
  protected service!: Service<any>;

  async index(req, res, next) {
    const { userId } = req;

    const items = await this.service.getAllByUserId(userId);
    return res.status(200).json(items);
  }

  async show(req, res, next) {
    const {
      userId,
      params: { id },
    } = req;

    const item = await this.service.verifyAndGet(id, userId);

    return res.status(200).json(item);
  }

  async store(req, res, next) {
    const { userId } = req;

    const item = await this.service.create(req.body, userId);

    return res.status(201).json(item);
  }

  async update(req, res, next) {
    const {
      userId: user_id,
      params: { id },
    } = req;

    const item = await this.service.update(req.body, id, user_id);

    return res.status(200).json(item);
  }

  async delete(req, res, next) {
    const {
      userId,
      params: { id },
    } = req;

    await this.service.delete(id, userId);

    return res.status(204).json();
  }
}
