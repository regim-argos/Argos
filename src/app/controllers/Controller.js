export default class Controller {
  constructor(service) {
    this.service = service;
  }

  async index(req, res, next) {
    const { userId } = req;
    const { search } = req.query;

    const items = await this.service.getAllByUserId(userId, search);
    req.response = items;
    res.status(200).json(items);
    return next();
  }

  async show(req, res, next) {
    const {
      userId,
      userRole,
      params: { id },
    } = req;

    const item = await this.service.verifyAndGet(id, userId, userRole);

    req.response = item;
    res.status(200).json(item);
    return next();
  }

  async store(req, res, next) {
    const { userId } = req;

    const item = await this.service.create(req.body, userId);

    res.status(201).json(item);
    return next();
  }

  async update(req, res, next) {
    const {
      userId: user_id,
      params: { id },
    } = req;

    const item = await this.service.update(req.body, id, user_id);

    res.status(200).json(item);
    return next();
  }

  async delete(req, res, next) {
    const {
      userId,
      params: { id },
    } = req;

    await this.service.delete(id, userId);

    res.status(204).json();
    return next();
  }
}
