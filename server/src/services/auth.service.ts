import type { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Admin } from '../entities/Admin';
import { AppDataSource } from '../../orm.config';
import { jwtOptions } from '../config/authConfig';
import jwt from 'jsonwebtoken';

const generateAccessToken = (username: string): string => {
  const payload = {
    username,
  };

  return jwt.sign(payload, jwtOptions.secret, { expiresIn: '24h' });
};

export class AuthService {
  async adminLogin(req: Request, res: Response): Promise<Response> {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const errorMessage = errors.array()[0].msg;

        return res.status(400).json({ message: errorMessage });
      }

      const { username, password } = req.body;

      const admin = await AppDataSource.manager.findOneBy(Admin, {
        username,
      });

      if (admin === null || admin === undefined) {
        return res.status(404).json({ message: `User ${username} not found` });
      }

      if (password !== admin.password) {
        return res.status(400).json({ message: 'Incorrect password' });
      }

      const token = generateAccessToken(admin.username);

      return res
        .status(200)
        .json({ message: 'Authentication completed', token });
    } catch (err) {
      console.log(err);
      return res.status(401).json({ message: 'Login error' });
    }
  }
}
