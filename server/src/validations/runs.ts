import { check } from 'express-validator';

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
  check('newRunEndDate')
    .trim()
    .escape()
    .notEmpty()
    .isDate()
    .withMessage('Correct end date is required'),
];

export const getRunValidation = [
  check('runStartDate')
    .trim()
    .escape()
    .exists()
    .notEmpty()
    .isDate()
    .withMessage('Correct start date is required'),
];

export const deleteRunValidation = [
  check('runStartDate')
    .trim()
    .escape()
    .exists()
    .notEmpty()
    .isDate()
    .withMessage('Correct start date is required'),
];
