import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { logger } from '../utils/logger.js';

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return res.status(401).json({ success: false, message: 'Not authorized, no token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ success: false, message: 'User no longer exists' });
    if (!user.isActive) return res.status(403).json({ success: false, message: 'Account deactivated' });
    req.user = user;
    next();
  } catch (error) {
    logger.error('Auth middleware error:', error.name);
    const message = error.name === 'TokenExpiredError' ? 'Token expired' : 'Not authorized, invalid token';
    return res.status(401).json({ success: false, message });
  }
};

export const admin = (req, res, next) => {
  if (req.user?.role === 'admin') return next();
  res.status(403).json({ success: false, message: 'Admin access required' });
};

export const artisanOrAdmin = (req, res, next) => {
  if (req.user?.role === 'admin' || req.user?.role === 'artisan') return next();
  res.status(403).json({ success: false, message: 'Artisan or admin access required' });
};
