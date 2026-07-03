import jwt from 'jsonwebtoken';

export const generateToken = (userId, expiresIn = process.env.JWT_EXPIRE || '7d') => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn });
};

export const generateShortToken = (userId) => generateToken(userId, '1h');
