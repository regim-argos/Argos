import BadRequestError from '../Error/BadRequestError';

class Validator {
  async validate(schema, data) {
    try {
      const response = await schema.validate(data, {
        abortEarly: true,
        stripUnknown: true,
      });
      return response;
    } catch (err) {
      throw new BadRequestError(err.errors[0]);
    }
  }
}

export default Validator;
