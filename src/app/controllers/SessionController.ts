import { Request, Response, NextFunction } from 'express';

import UserServices from '../Services/UserServices';

class SessionController {
  async store(req: Request, res: Response, next: NextFunction) {
    const { user, token } = await UserServices.session(req.body);

    return res.status(201).json({
      user,
      token,
    });
  }
}

export default new SessionController();
