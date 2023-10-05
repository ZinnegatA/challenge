import type { Request, Response } from 'express';
import { Admin } from '../entities/Admin';
import { AppDataSource } from '../../orm.config';
import { generateAccessToken } from '../utils/auth.helper';
import { compareSync } from 'bcrypt';
import 'dotenv/config';
import { validateRequest } from '../utils/validation.helper';

export class AuthService {
  async adminLogin(req: Request, res: Response): Promise<Response> {
    try {
      validateRequest(req, res);

      const { username, password } = req.body;

      const admin = await AppDataSource.manager.findOneBy(Admin, {
        username,
      });

      if (!admin) {
        return res.status(401).json({ message: `User ${username} not found` });
      }

      const validPassword = compareSync(password, admin.password);

      if (!validPassword) {
        return res.status(401).json({ message: 'Incorrect password' });
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
