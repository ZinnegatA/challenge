import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

class ValidationError extends Error {
  type: string;

  constructor(args) {
    super(args);
    this.type = 'ValidationError';
  }
}

export const validateRequest = function (req: Request, res: Response): void {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessage = errors.array().reduce((message, { msg }) => {
      return `${message} ${msg};`;
    }, 'Validation error:');

    throw new ValidationError(errorMessage);
  }
};
