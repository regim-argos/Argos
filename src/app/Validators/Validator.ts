/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Yup from 'yup';
import BadRequestError from '../Error/BadRequestError';

class Validator {
  protected createSchema!: Yup.ObjectSchema | Yup.ArraySchema<Yup.ObjectSchema>;

  protected updateSchema!: Yup.ObjectSchema | Yup.ArraySchema<Yup.ObjectSchema>;

  async validate<T>(
    schema: Yup.ObjectSchema | Yup.ArraySchema<Yup.ObjectSchema>,
    data: any
  ) {
    try {
      const response = await schema.validate(data, {
        abortEarly: true,
        stripUnknown: true,
      });
      return (response as unknown) as T;
    } catch (err) {
      throw new BadRequestError(err.errors[0]);
    }
  }

  async createValidator<T>(payload: any) {
    return this.validate<T>(this.createSchema, payload);
  }

  async updateValidator<T>(payload: any) {
    return this.validate<T>(this.updateSchema, payload);
  }
}

export default Validator;
