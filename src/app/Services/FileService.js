import BadRequestError from '../Error/BadRequestError';
import File from '../models/File';
// import FileValidator from '../Validators/MealValidator';
// import { notFound } from '../Error/TypeErrors';
// import ProductService from './ProductService';

class FileServices {
  constructor() {
    this.model = File;
  }

  async verifyAndGetFile(id, userId) {
    const file = await this.model.getFileById(id, userId);
    if (!file) throw new BadRequestError('Image not found');
    return file;
  }

  async create(data, userId) {
    return this.model.create(data, userId);
  }

  // async delete(id) {
  //   const deleteds = await FileQuery.deleteFileById(id);
  //   if (!deleteds === 0) throw new ValidationError(badRequest('Invalid token'));
  //   return true;
  // }
}

export default new FileServices();
