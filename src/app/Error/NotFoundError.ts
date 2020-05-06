import ArgosError from './ArgosError';

export default class NotFoundError extends ArgosError {
  constructor(entity) {
    super(`${entity} not found`, 'notFound', 404);
  }
}
