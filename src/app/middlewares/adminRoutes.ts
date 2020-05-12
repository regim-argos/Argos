import { Request, Response, NextFunction } from 'express';

export default async (req: Request, res: Response, next: NextFunction) => {
  if (req.userRole !== 'ADMIN') {
    return res.status(403).json({
      status: 'error',
      message: 'Forbidden',
    });
  }
  return next();
};
