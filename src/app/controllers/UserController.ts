import { Request, Response, NextFunction } from 'express';
import UserServices from '../Services/UserServices';

class UserController {
  async store(req: Request, res: Response, next: NextFunction) {
    const { id, name, email } = await UserServices.create(req.body);
    return res.status(201).json({
      id,
      name,
      email,
    });
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const { id, name, email, imageId, image } = await UserServices.update(
      req.body,
      req.userId
    );
    return res.status(200).json({
      id,
      name,
      email,
      imageId,
      image,
    });
  }
}

export default new UserController();
