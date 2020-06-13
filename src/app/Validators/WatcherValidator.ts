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

  protected watcherDetailSchema = Yup.object().shape({
    month: Yup.number().min(1).max(12),
    year: Yup.number(),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async watcherDetailValidator<T>(payload: any) {
    return this.validate<T>(this.watcherDetailSchema, payload);
  }
}

export default new WatcherValidator();
