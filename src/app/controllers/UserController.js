import UserServices from '../Services/UserServices';

class UserController {
  async store(req, res) {
    const { id, name, email } = await UserServices.create(req.body);
    return res.status(201).json({
      id,
      name,
      email,
    });
  }

  async update(req, res, next) {
    const { id, name, email, imageId, image } = await UserServices.update(
      req.body,
      req.userId
    );
    res.json({
      id,
      name,
      email,
      imageId,
      image,
    });
    return next();
  }
}

export default new UserController();
