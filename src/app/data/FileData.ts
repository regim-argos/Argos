import File from './models/File';

class FileData {
  protected model = File;

  async getFileById(id: number, userId: number) {
    return this.model.getFileById(id, userId);
  }

  async createOne(data: Partial<File>, userId: number) {
    return this.model.createOne(data, userId);
  }
}

export default new FileData();
