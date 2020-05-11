import Cache from './cache/Cache';

interface IModel<T> {
  getAllByUserId(userId: number): Promise<T[]>;
  getById(id: number, userId: number): Promise<T | null>;
  createOne(data: T, userId: number): Promise<T>;
  updateById(data: T, id: number, userId: number): Promise<T>;
  deleteById(id: number, userId: number): Promise<number>;
}
class Data<T> {
  protected model!: IModel<T>;

  protected cache?: Cache;

  async getAllByUserId(userId: number) {
    let value = await this.cache?.getCache(userId, 'all');

    if (value) return value;

    value = await this.model.getAllByUserId(userId);

    await this.cache?.setCache(userId, 'all', value);

    return value;
  }

  async getById(id: number, userId: number) {
    let value = await this.cache?.getCache(userId, id);

    if (value) return value;

    value = await this.model.getById(id, userId);

    await this.cache?.setCache(userId, id, value);

    return value;
  }

  async create(data: T, userId: number) {
    const value = await this.model.createOne(data, userId);
    await this.cache?.invalidateCreate(userId);
    return value;
  }

  async updateById(data: T, id: number, userId: number) {
    const value = await this.model.updateById(data, id, userId);
    await this.cache?.invalidateUpdate(userId, id);
    return value;
  }

  async deleteById(id: number, userId: number) {
    const value = await this.model.deleteById(id, userId);
    await this.cache?.invalidateUpdate(userId, id);
    return value;
  }
}

export default Data;
