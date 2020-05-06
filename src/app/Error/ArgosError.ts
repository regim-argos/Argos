export default class ArgosError extends Error {
  constructor(message, type, status) {
    super();
    this.message = message;
    this.type = type;
    this.status = status;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ArgosError);
    }

    this.name = 'ArgosValidationError';
    this.body = {
      status: 'error',
      message: this.message,
    };
  }
}
