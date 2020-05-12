import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = (await promisify(jwt.verify)(
      token,
      authConfig.secret as string
    )) as { id: number; role: string };
    req.userId = decoded.id;
    req.userRole = decoded.role;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};
