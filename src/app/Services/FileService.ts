import BadRequestError from '../Error/BadRequestError';
import File from '../data/models/File';
import FileData from '../data/FileData';

class FileServices {
  protected model = FileData;

  async verifyAndGetFile(id: number, userId: number) {
    const file = await this.model.getFileById(id, userId);
    if (!file) throw new BadRequestError('Image not found');
    return file;
  }

  async create(data: Partial<File>, userId: number) {
    return this.model.createOne(data, userId);
  }
}

export default new FileServices();
