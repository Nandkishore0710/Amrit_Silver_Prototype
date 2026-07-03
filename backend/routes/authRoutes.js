import express from 'express';
import {
  register, verifyEmail, login, googleAuth, googleCallback,
  logout, getMe, updateProfile, forgotPassword, resetPassword, changePassword
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validateRegister, validateLogin } from '../middleware/validators.js';

const router = express.Router();

router.post('/register', validateRegister, register);
router.get('/verify-email/:token', verifyEmail);
router.post('/login', validateLogin, login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.put('/change-password', protect, changePassword);

// Google OAuth
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);

export default router;
