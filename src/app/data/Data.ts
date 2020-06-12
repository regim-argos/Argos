import { CacheDecorator } from '@app/utils/CacheDecorator';
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

  @CacheDecorator(1)
  async getAllByProjectId(projectId: number) {
    return this.model.getAllByProjectId(projectId);
  }

  @CacheDecorator(0, 1)
  async getById(id: number, projectId: number) {
    return this.model.getById(id, projectId);
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
