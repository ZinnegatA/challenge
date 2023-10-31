import { check, param } from 'express-validator';

export const createTaskValidation = [
  check('id')
    .trim()
    .escape()
    .exists()
    .notEmpty()
    .withMessage('Correct task ID is required'),
  check('runId')
    .trim()
    .escape()
    .exists()
    .notEmpty()
    .isNumeric()
    .withMessage('Correct run ID is required'),
];

export const getTaskValidation = [
  param('id')
    .trim()
    .escape()
    .exists()
    .notEmpty()
    .withMessage('Correct task ID is required'),
];
