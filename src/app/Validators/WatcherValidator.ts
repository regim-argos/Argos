import * as Yup from 'yup';
import Validator from './Validator';

class WatcherValidator extends Validator {
  protected createSchema = Yup.object().shape({
    name: Yup.string().trim().required(),
    url: Yup.string().url().trim().required(),
    status: Yup.boolean(),
    delay: Yup.number().integer().min(10),
    active: Yup.boolean(),
    notifications: Yup.array()
      .default([])
      .of(
        Yup.object().shape({
          id: Yup.number().integer().min(1).required(),
        })
      ),
  });

  protected updateSchema = Yup.object().shape({
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
  });
}

export default new WatcherValidator();
