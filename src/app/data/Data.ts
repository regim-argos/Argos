import Cache from './cache/Cache';

interface IModel<T> {
  getAllByProjectId(projectId: number): Promise<T[]>;
  getById(id: number, userId: number): Promise<T | null>;
  createOne(data: T, projectId: number): Promise<T>;
  updateById(data: Partial<T>, id: number, userId: number): Promise<T>;
  deleteById(id: number, userId: number): Promise<number>;
}
class Data<T> {
  protected model!: IModel<T>;

  protected cache?: Cache;

  async getAllByProjectId(projectId: number) {
    let value = await this.cache?.getCache(projectId, 'all');

    if (value) return value;

    value = await this.model.getAllByProjectId(projectId);

    await this.cache?.setCache(projectId, 'all', value);

    return value;
  }

  async getById(id: number, userId: number) {
    let value = await this.cache?.getCache(userId, id);

    if (value) return value;

    value = await this.model.getById(id, userId);

    await this.cache?.setCache(userId, id, value);

    return value;
  }

  async create(data: T, projectId: number) {
    const value = await this.model.createOne(data, projectId);
    await this.cache?.invalidateCreate(projectId);
    return value;
  }

  async updateById(data: Partial<T>, id: number, userId: number) {
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
