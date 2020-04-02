import FileService from '../Services/FileService';

class FileController {
  async store(req, res) {
    const { originalname: name, filename: path, key: keyS3 } = req.file;
    const key = path || keyS3;
    const file = await FileService.create({ name, path: key }, req.userId);

    return res.json(file);
  }
}

export default new FileController();
