import ArgosError from './ArgosError';

export default class UnauthorizedError extends ArgosError {
  constructor() {
    super('Unauthorized', 'unauthorized', 401);
  }
}
