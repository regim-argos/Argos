import File from '../models/File';

class FileQuery {
  async getFileById(id, userId) {
    const DocFile = await File.findOne({ where: { id, userId } });

    return DocFile && DocFile.get();
  }

  async create(data, userId) {
    const DocFile = await File.create({
      ...data,
      userId,
    });

    return DocFile && DocFile.get();
  }

  // async deleteFileById(id) {
  //   return File.destroy({
  //     where: { id },
  //   });
  // }
}

export default new FileQuery();
