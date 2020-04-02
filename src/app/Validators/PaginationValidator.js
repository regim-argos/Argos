import { number, object } from 'yup';
import Validator from './Validator';

class PaginationValidator extends Validator {
  constructor() {
    super();
    this.paginationSchema = object().shape({
      page: number()
        .min(1)
        .default(1),
    });
  }

  async paginationValidate(data) {
    return this.validate(this.paginationSchema, data);
  }
}

export default new PaginationValidator();
