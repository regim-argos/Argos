import * as Yup from 'yup';
import Validator from './Validator';

class WatcherValidator extends Validator {
  constructor() {
    super();
    this.createSchema = Yup.object().shape({
      platform: Yup.string().required().trim(),
      platformData: Yup.object().required().shape({
        webhook: Yup.string().url().required(),
      }),
    });

    this.updateSchema = Yup.object().shape({
      platform: Yup.string().trim(),
      platformData: Yup.object().default(undefined).shape({
        webhook: Yup.string().url().required(),
      }),
    });
  }
}

export default new WatcherValidator();
