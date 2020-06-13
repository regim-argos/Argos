import Validator from '../Validators/Validator';
import Data from '../data/Data';

export default abstract class IService<T> {
  public name?: string;

  protected model: Data<T>;

  public validator: Validator;

  abstract getAllByProjectId(userId: number, projectId: number): Promise<T[]>;

  abstract verifyAndGet(
    id: number,
    userId: number,
    projectId: number
  ): Promise<T | null>;

  abstract create(data: object, userId: number, projectId: number): Promise<T>;

  abstract update(
    data: object,
    id: number,
    userId: number,
    projectId: number
  ): Promise<T>;

  abstract delete(id: number, userId: number, projectId: number): Promise<T>;
}
