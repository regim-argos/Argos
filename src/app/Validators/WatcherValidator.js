import * as Yup from 'yup';
import Validator from './Validator';

class WatcherValidator extends Validator {
  constructor() {
    super();
    const base = {
      name: Yup.string().trim(),
      url: Yup.string().url().trim(),
      status: Yup.boolean(),
      delay: Yup.number().integer().min(10),
      active: Yup.boolean(),
      notifications: Yup.array().of(
        Yup.object().shape({
          id: Yup.number().integer().min(1).required(),
        })
      ),
    };
    this.createSchema = Yup.object().shape({
      name: base.name.required(),
      url: base.url.required(),
      notifications: base.notifications.default([]),
      ...base,
    });

    this.updateSchema = Yup.object().shape({
      ...base,
    });
  }
}

export default new WatcherValidator();
