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

  async verifyAndGet(id, userId) {
    const item = await this.model.getById(id, userId);
    if (!item) throw new NotFoundError(this.name);
    return item;
  }

  async create(data, userId) {
    const validated = await this.validator.createValidator(data);
    await this.dbValidatorCreate(validated, userId);

    const item = await this.model.create(validated, userId);

    return item;
  }

  async update(data, id, userId, returnOld) {
    const validated = await this.validator.updateValidator(data);
    const oldValue = await this.verifyAndGet(id, userId);

    await this.dbValidatorUpdate(validated, userId, id, oldValue);
    const updated = await this.model.updateById(validated, id, userId);

    if (!returnOld) return updated;
    return { old: oldValue, newValue: updated };
  }

  async delete(id, userId) {
    const item = await this.verifyAndGet(id, userId);
    await this.model.deleteById(id, userId);
    return item;
  }

  // eslint-disable-next-line no-empty-function
  async dbValidatorCreate() {}

  // eslint-disable-next-line no-empty-function
  async dbValidatorUpdate() {}
}
