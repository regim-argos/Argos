import BadRequestError from '../Error/BadRequestError';
import File from '../data/models/File';
import Model from '../data/models/Model';
// import FileValidator from '../Validators/MealValidator';
// import { notFound } from '../Error/TypeErrors';
// import ProductService from './ProductService';

class FileServices {
  public model: typeof File;
  constructor() {
    this.model = File;
  }

  async verifyAndGetFile(id: number, userId: number) {
    const file = await this.model.getFileById(id, userId);
    if (!file) throw new BadRequestError('Image not found');
    return file;
  }

  async create(data: any, userId: number) {
    return this.model.createOne(data, userId);
  }

  // async delete(id) {
  //   const deleteds = await FileQuery.deleteFileById(id);
  //   if (!deleteds === 0) throw new ValidationError(badRequest('Invalid token'));
  //   return true;
  // }
}

export default new FileServices();
