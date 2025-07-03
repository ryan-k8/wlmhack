import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: any;
}

export enum USER_ROLE {
  ADMIN = 'admin',
  USER = 'customer',
  PARTNER = 'partner',
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

    (req as AuthRequest).user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const withRole = (role: Array<USER_ROLE>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!role.includes((req as AuthRequest).user?.role)) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }
    next();
  };
};
