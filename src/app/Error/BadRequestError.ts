import ArgosError from './ArgosError';

export default class BadRequestError extends ArgosError {
  constructor(details: string) {
    const defaultMessage = 'Invalid request arguments';
    const message = details || defaultMessage;
    super(message, 'badRequest', 400);
  }
}
