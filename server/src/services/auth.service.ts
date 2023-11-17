import { compareSync } from 'bcrypt';
import type { Request, Response } from 'express';
import { AppDataSource } from '../../orm.config';
import { Admin } from '../entities/Admin';
import { User } from '../entities/User';
import { generateAccessToken } from '../utils/auth.helper';
import { validateRequest } from '../utils/validation.helper';
import jwt from 'jsonwebtoken';

import 'dotenv/config';
import { DecodedUser } from '../interfaces/auth.interfaces';
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

      const token = generateAccessToken(
        admin.username,
        '10s',
        process.env.SECRET_KEY,
      );
      const refreshToken = generateAccessToken(
        admin.username,
        '30m',
        process.env.REFRESH_TOKEN_SECRET_KEY,
      );

      return res
        .cookie('refreshToken', refreshToken, {
          httpOnly: true,
          sameSite: 'strict',
          maxAge: 604800000,
        })
        .status(200)
        .json({ message: 'Authentication completed', token });
    } catch (err) {
      console.log(err);
      return res.status(401).json({ message: 'Login error' });
    }
  }

  async registerUser(req: Request, res: Response): Promise<Response> {
    try {
      validateRequest(req, res);

      const { firstName, lastName, telescope_link, codewars_username, photo } =
        req.body;

      const user = AppDataSource.manager.create(User, {
        firstName,
        lastName,
        telescope_link,
        codewars_username,
        photo,
      });

      await AppDataSource.manager.save(user);

      return res
        .status(200)
        .json({ message: 'The user has been successfully created' });
    } catch (err) {
      console.log(err);
      return res.status(401).json({
        message: err.message ?? 'Error during user registration process',
      });
    }
  }

  async refreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).send('Access Denied. No refresh token provided.');
    }

    try {
      const decodedUser = jwt.verify(
        refreshToken,
        process.env.SECRET_KEY!,
      ) as DecodedUser;

      const accessToken = jwt.sign(
        { user: decodedUser.username },
        process.env.SECRET_KEY!,
        { expiresIn: '1m' },
      );

      res.status(200).send({
        message: 'The token was successfully updated',
        token: accessToken,
      });
    } catch (error) {
      return res.status(400).send('Invalid refresh token.');
    }
  }
}
