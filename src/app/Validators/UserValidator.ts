import * as Yup from 'yup';
import Validator from './Validator';

class UserValidator extends Validator {
  constructor() {
    super();
    const base = {
      name: Yup.string(),
      email: Yup.string().email(),
      imageId: Yup.number().integer().min(1),
      password: Yup.string().min(6),
    };
    const passwordSchema = {
      password: Yup.string().min(6),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    };
    this.createSchema = Yup.object().shape({
      name: base.name.required(),
      email: base.email.required(),
      password: base.password.required(),
    });

    this.updateSchema = Yup.object().shape({
      name: base.name,
      imageId: base.imageId,
      oldPassword: Yup.string()
        .min(6)
        .when('password', (password, field) =>
          password ? field.required() : field
        ),
      ...passwordSchema,
    });

    this.updatePasswordSchema = Yup.object().shape({
      ...passwordSchema,
    });
  }

  async updatePassword(payload) {
    return this.validate(this.updatePasswordSchema, payload);
  }
}

export default new UserValidator();
