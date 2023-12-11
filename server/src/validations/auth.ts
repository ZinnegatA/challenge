import { check } from 'express-validator';
import { CodewarsApi } from '../utils/codewars-api';

const cwApi = new CodewarsApi();

const REGISTRATION_FIELDS = {
  FIRST_NAME: 'firstName',
  LAST_NAME: 'lastName',
  TELESCOPE_LINK: 'telescopeLink',
  CODEWARS_USERNAME: 'codewarsUsername',
};

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
  check(REGISTRATION_FIELDS.FIRST_NAME)
    .trim()
    .escape()
    .notEmpty()
    .withMessage(`${REGISTRATION_FIELDS.FIRST_NAME} is required field`),
  check(REGISTRATION_FIELDS.LAST_NAME)
    .trim()
    .escape()
    .notEmpty()
    .withMessage(`${REGISTRATION_FIELDS.LAST_NAME} is required field`),
  check(REGISTRATION_FIELDS.TELESCOPE_LINK)
    .trim()
    .notEmpty()
    .withMessage(`${REGISTRATION_FIELDS.TELESCOPE_LINK} is required field`)
    .isURL()
    .withMessage(
      `${REGISTRATION_FIELDS.TELESCOPE_LINK} should have URL Format`,
    ),
  check(REGISTRATION_FIELDS.CODEWARS_USERNAME)
    .trim()
    .notEmpty()
    .withMessage(`${REGISTRATION_FIELDS.CODEWARS_USERNAME} is required field`)
    .custom(cwApi.ValidateUsernameIsExistInCodeWars),
];
