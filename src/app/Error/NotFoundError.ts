import ArgosError from './ArgosError';

export default class NotFoundError extends ArgosError {
  constructor(entity: string) {
    super(`${entity} not found`, 'notFound', 404);
  }
}
