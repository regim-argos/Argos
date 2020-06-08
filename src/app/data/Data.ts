import Cache from './cache/Cache';

interface IModel<T> {
  getAllByProjectId(projectId: number): Promise<T[]>;
  getById(id: number, projectId: number): Promise<T | null>;
  createOne(data: T, projectId: number): Promise<T>;
  updateById(data: Partial<T>, id: number, projectId: number): Promise<T>;
  deleteById(id: number, projectId: number): Promise<number>;
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

  async getById(id: number, projectId: number) {
    let value = await this.cache?.getCache(projectId, id);

    if (value) return value;

    value = await this.model.getById(id, projectId);

    await this.cache?.setCache(projectId, id, value);

    return value;
  }

  async create(data: T, projectId: number) {
    const value = await this.model.createOne(data, projectId);
    await this.cache?.invalidateCreate(projectId);
    return value;
  }

  async updateById(data: Partial<T>, id: number, projectId: number) {
    const value = await this.model.updateById(data, id, projectId);
    await this.cache?.invalidateUpdate(projectId, id);
    return value;
  }

  async deleteById(id: number, projectId: number) {
    const value = await this.model.deleteById(id, projectId);
    await this.cache?.invalidateUpdate(projectId, id);
    return value;
  }
}

export default Data;
