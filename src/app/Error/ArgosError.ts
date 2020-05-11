export default class ArgosError extends Error {
  message!: string;

  type!: string;

  status!: number;

  body: {
    status: string;
    message: string;
  };

  constructor(message: string, type: string, status: number) {
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
