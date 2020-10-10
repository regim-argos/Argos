import { Request, Response, NextFunction } from 'express';

export default async (req: Request, res: Response, next: NextFunction) => {
  if (req.userId as unknown as string === 'ADMIN'){
    return next()
  }
  return res.status(401).json({ message: 'Invalid token' });
};
