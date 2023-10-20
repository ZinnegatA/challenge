import { check, param } from 'express-validator';

export const createRunValidation = [
  check('runStartDate')
    .trim()
    .escape()
    .exists()
    .notEmpty()
    .isDate()
    .withMessage('Correct start date is required'),
  check('runEndDate')
    .trim()
    .escape()
    .exists()
    .notEmpty()
    .isDate()
    .withMessage('Correct end date is required'),
];

export const updateRunValidation = [
  param('id')
    .trim()
    .escape()
    .exists()
    .notEmpty()
    .isNumeric()
    .withMessage('Correct run ID is required'),
  check('newRunEndDate')
    .trim()
    .escape()
    .notEmpty()
    .isDate()
    .withMessage('Correct end date is required'),
];

export const getRunValidation = [
  param('id')
    .trim()
    .escape()
    .exists()
    .notEmpty()
    .isNumeric()
    .withMessage('Correct run ID is required'),
];
