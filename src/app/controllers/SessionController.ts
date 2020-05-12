import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import { Request, Response, NextFunction } from 'express';

import authConfig from '../../config/auth';
import UserServices from '../Services/UserServices';

// TODO refazer session
class SessionController {
  async store(req: Request, res: Response, next: NextFunction) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    try {
      await schema.validate(req.body);
    } catch (error) {
      return res.status(400).json({ error: error.errors[0] });
    }

    const { email, password } = req.body;

    const user = await UserServices.verifyAndGetUserByEmail(email);

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name, image, role } = user;

    return res.status(201).json({
      user: {
        id,
        name,
        email,
        image,
      },
      token: jwt.sign(
        { id, role },
        authConfig.secret as string,
        role === 'ADMIN'
          ? {}
          : {
              expiresIn: authConfig.expiresIn,
            }
      ),
    });
  }
}

export default new SessionController();
