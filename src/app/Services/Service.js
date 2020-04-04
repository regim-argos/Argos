import NotFoundError from '../Error/NotFoundError';

export default class Service {
  constructor(name, model, validator) {
    this.model = model;
    this.name = name;
    this.validator = validator;
  }

  async getAllByUserId(userId, search) {
    return this.model.getAllByUserId(userId, search);
  }

  async verifyAndGet(id, userId, role) {
    const item = await this.model.getById(
      id,
      role === 'ADMIN' ? undefined : userId
    );
    if (!item) throw new NotFoundError(this.name);
    return item;
  }

  async create(data, userId) {
    const validated = await this.validator.createValidator(data);

    const item = await this.model.create(validated, userId);

    return item;
  }

  async update(data, id, userId) {
    const validated = await this.validator.updateValidator(data);

    const dbItem = await this.verifyAndGet(id, userId);
    const updated = await this.model.updateById(validated, id, userId);

    return { old: dbItem, newValue: updated };
  }

  async delete(id, userId) {
    const item = await this.verifyAndGet(id, userId);
    await this.model.deleteById(id, userId);
    return item;
  }
}
