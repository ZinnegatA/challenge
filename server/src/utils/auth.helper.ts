import jwt from 'jsonwebtoken';
import {
  CodeWarsUser,
  CodeWarsUserNotFound,
} from '../interfaces/codewars.interfaces';

export const generateAccessToken = (username: string): string => {
  const payload = {
    username,
  };

  const secretKey = process.env.SECRET_KEY;

  if (!secretKey) throw new Error('Specify secret key');

  return jwt.sign(payload, secretKey, { expiresIn: '24h' });
};

export const getUserByUserNameFromCodeWars = async (
  username: string,
): Promise<CodeWarsUserNotFound | CodeWarsUser> => {
  const userFromCodeWars = await (
    await fetch(`https://www.codewars.com/api/v1/users/${username}`)
  ).json();

  if (!userFromCodeWars) throw new Error('Error during call codewars api');

  return userFromCodeWars;
};
