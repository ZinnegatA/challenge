import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtOptions } from '../config/authConfig';

export const authMiddleware = function (
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (req.method === 'OPTIONS') {
    next();
    return;
  }

  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (token === undefined) throw new Error();

    const decodedData = jwt.verify(token, jwtOptions.secret);

    req.user = decodedData;
    next();
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: 'Authorization failed' });
  }
};
