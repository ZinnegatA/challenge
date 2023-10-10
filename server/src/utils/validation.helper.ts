import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

export const validateRequest = function (
  req: Request,
  res: Response,
): Response | undefined {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessage = errors.array()[0].msg;

    return res.status(400).json({ message: errorMessage });
  }
};
