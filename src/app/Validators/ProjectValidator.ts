import * as Yup from 'yup';
import Validator from './Validator';

class ProjectValidator extends Validator {
  protected createSchema = Yup.object().shape({
    name: Yup.string().trim().required(),
  });

  protected updateSchema = Yup.object().shape({
    name: Yup.string().trim(),
  });
}

export default new ProjectValidator();
