import { check } from 'express-validator';

export const adminLoginValidation = [
  check('username')
    .trim()
    .exists()
    .notEmpty()
    .withMessage('Correct username is required'),
  check('password')
    .trim()
    .escape()
    .exists()
    .notEmpty()
    .withMessage('Password is required'),
];

export const userRegisterValidation = [
  check('firstName')
    .trim()
    .exists()
    .notEmpty()
    .withMessage('Correct firstName is required'),
];
