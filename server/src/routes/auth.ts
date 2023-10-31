import express from 'express';
import {
  adminLoginValidation,
  userRegisterValidation,
} from '../validations/auth';
import { AuthService } from '../services/auth.service';

const router = express.Router();
const authService = new AuthService();

router.post('/login', adminLoginValidation, authService.adminLogin);

router.post('/register', userRegisterValidation, authService.registerUser);

export default router;
