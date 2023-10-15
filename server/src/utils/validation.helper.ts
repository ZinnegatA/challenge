import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

export const validateRequest = function (req: Request, res: Response): void {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessage = errors.array()[0].msg;

    throw new Error(errorMessage);
  }
};
