import express from 'express';
import {
  adminLoginValidation,
  userRegisterValidation,
} from '../validations/auth';
import { AuthService } from '../services/auth.service';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();
const authService = new AuthService();

router.post('/login', adminLoginValidation, authService.adminLogin);

router.post('/register', userRegisterValidation, authService.registerUser);

router.post('/refresh', authMiddleware, authService.refreshToken);

export default router;
