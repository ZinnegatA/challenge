import jwt from 'jsonwebtoken';

export const generateAccessToken = (username: string): string => {
  const payload = {
    username,
  };

  const secretKey = process.env.SECRET_KEY;

  if (!secretKey) throw new Error();

  return jwt.sign(payload, secretKey, { expiresIn: '24h' });
};
