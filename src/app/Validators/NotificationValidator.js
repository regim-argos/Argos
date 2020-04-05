import * as Yup from 'yup';
import Validator from './Validator';

class WatcherValidator extends Validator {
  constructor() {
    super();
    this.createSchema = Yup.object().shape({
      platform: Yup.string().required().trim(),
      platformData: Yup.mixed()
        .required()
        .transform((value) => JSON.stringify(value)),
      watcherId: Yup.number().integer().min(1).required(),
    });

    this.updateSchema = Yup.object().shape({
      platform: Yup.string().trim(),
      platformData: Yup.mixed().transform((value) => JSON.stringify(value)),
    });
  }
}

export default new WatcherValidator();
