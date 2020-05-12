import NotFoundError from '../Error/NotFoundError';
import Validator from '../Validators/Validator';
import Data from '../data/Data';

export default abstract class Service<U> {
  public name!: string;

  protected model!: Data<U>;

  public validator!: Validator;

  async getAllByUserId(userId: number) {
    return this.model.getAllByUserId(userId);
  }

  async verifyAndGet(id: number, userId: number) {
    const item = await this.model.getById(id, userId);
    if (!item) throw new NotFoundError(this.name);
    return item;
  }

  async create(data: object, userId: number) {
    const validated = await this.validator.createValidator<U>(data);
    await this.dbValidatorCreate(validated, userId);

    const item = await this.model.create(validated, userId);

    return item;
  }

  async update(data: object, id: number, userId: number) {
    const validated = await this.validator.updateValidator<U>(data);
    const oldValue = await this.verifyAndGet(id, userId);

    await this.dbValidatorUpdate(validated, userId, id, oldValue);
    const updated = await this.model.updateById(validated, id, userId);

    return updated;
  }

  async updateWithReturn(data: object, id: number, userId: number) {
    const validated = await this.validator.updateValidator<U>(data);
    const oldValue = await this.verifyAndGet(id, userId);

    await this.dbValidatorUpdate(validated, userId, id, oldValue);
    const updated = await this.model.updateById(validated, id, userId);

    return { old: oldValue, newValue: updated };
  }

  async delete(id: number, userId: number) {
    const item = await this.verifyAndGet(id, userId);
    await this.model.deleteById(id, userId);
    return item;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars, no-empty-function, @typescript-eslint/no-empty-function
  async dbValidatorCreate(validated: U, userId: number) {}

  // eslint-disable-next-line no-empty-function, @typescript-eslint/no-unused-vars, no-unused-vars, no-empty-function
  async dbValidatorUpdate(
    // eslint-disable-next-line no-empty-function, @typescript-eslint/no-unused-vars, no-unused-vars, no-empty-function
    validated: U,
    // eslint-disable-next-line no-empty-function, @typescript-eslint/no-unused-vars, no-unused-vars, no-empty-function
    userId: number,
    // eslint-disable-next-line no-empty-function, @typescript-eslint/no-unused-vars, no-unused-vars, no-empty-function
    id?: number,
    // eslint-disable-next-line no-empty-function, @typescript-eslint/no-unused-vars, no-unused-vars, no-empty-function
    oldValue?: U
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  ) {}
}
