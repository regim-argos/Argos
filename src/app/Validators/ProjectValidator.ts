import * as Yup from 'yup';
import Validator from './Validator';

class ProjectValidator extends Validator {
  protected createSchema = Yup.object().shape({
    name: Yup.string().trim().required(),
  });

  protected updateSchema = Yup.object().shape({
    name: Yup.string().trim(),
  });

  protected addMemberSchema = Yup.object().shape({
    email: Yup.string().required().email(),
  });

  async addMember<T>(payload: object) {
    return this.validate<T>(this.addMemberSchema, payload);
  }
}

export default new ProjectValidator();
