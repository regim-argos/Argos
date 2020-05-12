import { Request, Response, NextFunction } from 'express';
import UserServices from '../Services/UserServices';

class ForgetPasswordController {
  async store(req: Request, res: Response, next: NextFunction) {
    const {
      body: { email },
    } = req;
    await UserServices.createForgetPasswordHash(email);
    return res.status(204).json();
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const {
      params: { hash },
    } = req;
    await UserServices.forgetPassword(hash, req.body);
    return res.status(204).json();
  }
}

export default new ForgetPasswordController();
