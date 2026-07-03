import crypto from 'crypto';
import passport from 'passport';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { sendWelcomeEmail, sendEmailVerification, sendPasswordResetEmail } from '../services/emailService.js';
import { logger } from '../utils/logger.js';

// ─── Register ─────────────────────────────────────────────────────────────────
export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    // Email verification token
    const verifyToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(verifyToken).digest('hex');

    const user = await User.create({
      name,
      email,
      password,
      phone,
      emailVerificationToken: hashedToken,
      emailVerificationExpire: Date.now() + 24 * 60 * 60 * 1000 // 24h
    });

    const token = generateToken(user._id);

    await sendEmailVerification(email, name, verifyToken);
    await sendWelcomeEmail(email, name);

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please verify your email.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    logger.error('Register error:', error);
    next(error);
  }
};

// ─── Verify Email ──────────────────────────────────────────────────────────────
export const verifyEmail = async (req, res, next) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpire: { $gt: Date.now() }
    }).select('+emailVerificationToken +emailVerificationExpire');

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification token' });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);
    res.status(200).json({ success: true, message: 'Email verified successfully', token });
  } catch (error) {
    logger.error('Verify email error:', error);
    next(error);
  }
};

// ─── Login ─────────────────────────────────────────────────────────────────────
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user || !user.password) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account has been deactivated. Contact support.' });
    }

    user.lastActive = Date.now();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    logger.error('Login error:', error);
    next(error);
  }
};

// ─── Google OAuth initiate ────────────────────────────────────────────────────
export const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: false
});

// ─── Google OAuth callback ────────────────────────────────────────────────────
export const googleCallback = (req, res, next) => {
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth_failed` },
    async (err, user) => {
      if (err || !user) {
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
      }
      const token = generateToken(user._id);
      // Redirect to frontend with token in query (frontend stores in localStorage)
      res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
    }
  )(req, res, next);
};

// ─── Logout ────────────────────────────────────────────────────────────────────
export const logout = async (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// ─── Get Me ────────────────────────────────────────────────────────────────────
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('wishlist', 'name slug basePrice images')
      .lean();
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    logger.error('GetMe error:', error);
    next(error);
  }
};

// ─── Update Profile ────────────────────────────────────────────────────────────
export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, address, lastActive: Date.now() },
      { new: true, runValidators: true }
    );
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    logger.error('Update profile error:', error);
    next(error);
  }
};

// ─── Forgot Password ───────────────────────────────────────────────────────────
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      // Security: don't reveal if email exists
      return res.status(200).json({ success: true, message: 'If that email is registered, a reset link has been sent.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save({ validateBeforeSave: false });

    await sendPasswordResetEmail(email, user.name, resetToken);

    res.status(200).json({ success: true, message: 'If that email is registered, a reset link has been sent.' });
  } catch (error) {
    logger.error('Forgot password error:', error);
    next(error);
  }
};

// ─── Reset Password ────────────────────────────────────────────────────────────
export const resetPassword = async (req, res, next) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    }).select('+resetPasswordToken +resetPasswordExpire');

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const token = generateToken(user._id);
    res.status(200).json({ success: true, message: 'Password reset successful', token });
  } catch (error) {
    logger.error('Reset password error:', error);
    next(error);
  }
};

// ─── Change Password ───────────────────────────────────────────────────────────
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');

    if (!user.password) {
      return res.status(400).json({ success: false, message: 'No password set (OAuth account). Use forgot password.' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();
    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    logger.error('Change password error:', error);
    next(error);
  }
};
