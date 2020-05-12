import * as Yup from 'yup';
import Validator from './Validator';

class UserValidator extends Validator {
  protected createSchema = Yup.object().shape({
    name: Yup.string().required(),
    email: Yup.string().required().email(),
    password: Yup.string().required().min(6),
  });

  protected updateSchema = Yup.object().shape({
    name: Yup.string(),
    imageId: Yup.number().integer().min(1),
    oldPassword: Yup.string()
      .min(6)
      .when('password', (password: string, field: Yup.StringSchema<string>) =>
        password ? field.required() : field
      ),
    password: Yup.string().min(6),
    confirmPassword: Yup.string().when(
      'password',
      (password: string, field: Yup.StringSchema<string>) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
    ),
  });

  protected updatePasswordSchema = Yup.object().shape({
    password: Yup.string().min(6),
    confirmPassword: Yup.string().when(
      'password',
      (password: string, field: Yup.StringSchema<string>) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
    ),
  });

  async updatePassword<T>(payload: object) {
    return this.validate<T>(this.updatePasswordSchema, payload);
  }
}

export default new UserValidator();
