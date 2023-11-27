import jwt from 'jsonwebtoken';

export const generateAccessToken = (
  username: string,
  expiresIn: string,
  secretKey?: string,
): string => {
  const payload = {
    username,
  };

  if (!secretKey) throw new Error('Specify secret key');

  return jwt.sign(payload, secretKey, { expiresIn });
};
