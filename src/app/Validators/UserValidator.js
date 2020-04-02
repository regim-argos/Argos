import * as Yup from 'yup';
import Validator from './Validator';

class UserValidator extends Validator {
  constructor() {
    super();

    this.createSchema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    this.updateSchema = Yup.object().shape({
      name: Yup.string(),
      imageId: Yup.number()
        .integer()
        .min(1),
      oldPassword: Yup.string()
        .min(6)
        .when('password', (password, field) =>
          password ? field.required() : field
        ),
      password: Yup.string().min(6),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    this.updatePasswordSchema = Yup.object().shape({
      password: Yup.string()
        .min(6)
        .required(),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });
  }

  async createValidator(payload) {
    return this.validate(this.createSchema, payload);
  }

  async updateValidator(payload) {
    return this.validate(this.updateSchema, payload);
  }

  async updatePassword(payload) {
    return this.validate(this.updatePasswordSchema, payload);
  }
}

export default new UserValidator();
