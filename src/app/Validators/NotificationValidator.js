import * as Yup from 'yup';
import Validator from './Validator';

class WatcherValidator extends Validator {
  constructor() {
    super();
    this.createSchema = Yup.object().shape({
      platform: Yup.string().required().trim(),
      platformData: Yup.mixed().required(),
    });

    this.updateSchema = Yup.object().shape({
      platform: Yup.string().trim(),
      platformData: Yup.mixed(),
    });
  }
}

export default new WatcherValidator();
