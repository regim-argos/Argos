import * as Yup from 'yup';
import Validator from './Validator';

class WatcherValidator extends Validator {
  constructor() {
    super();
    this.createSchema = Yup.object().shape({
      name: Yup.string().required().trim(),
      url: Yup.string().required().trim(),
      status: Yup.boolean(),
      delay: Yup.number().integer().min(5),
      active: Yup.boolean(),
    });

    this.updateSchema = Yup.object().shape({
      name: Yup.string().trim(),
      url: Yup.string().trim(),
      status: Yup.boolean(),
      delay: Yup.number().integer().min(5),
      active: Yup.boolean(),
    });
  }
}

export default new WatcherValidator();
