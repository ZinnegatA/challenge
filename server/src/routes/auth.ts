import express from 'express';
import { adminLoginValidation } from '../validations/auth';
import { AuthService } from '../services/auth.service';

const router = express.Router();
const authService = new AuthService();

router.post('/login', adminLoginValidation, authService.adminLogin);

export default router;
