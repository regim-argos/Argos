import ArgosError from './ArgosError';

export default class BadRequestError extends ArgosError {
  constructor(details) {
    const restMessage = '. Checkout documentation for more info: ';
    const defaultMessage = 'Invalid request arguments';
    const message = (details || defaultMessage) + restMessage;
    super(message, 'badRequest', 400);
  }
}
