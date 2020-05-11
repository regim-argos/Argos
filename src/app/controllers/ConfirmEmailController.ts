import { Request, Response, NextFunction } from 'express';
import UserServices from '../Services/UserServices';

class ConfirmEmailController {
  async store(req: Request, res: Response, next: NextFunction) {
    const {
      body: { email },
    } = req;

    await UserServices.createConfirmEmailHash(email);

    return res.status(204).json();
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const {
      params: { hash },
    } = req;
    await UserServices.confirmEmail(hash);

    return res.status(204).json();
  }
}

export default new ConfirmEmailController();
