import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { AppError } from '../utils/appError';

interface JwtPayload {
  id: string;
  role: string;
}

/**
 * Middleware to protect routes by verifying JWT tokens.
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const protect = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return next(new AppError('Authorization token is missing', 401));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return next(new AppError('User not found', 401));
    req.user = user;
    next();
  } catch (err) {
    next(new AppError('Invalid or expired token', 401));
  }
};

/**
 * Middleware to authorize users based on roles.
 * @param roles - Array of allowed roles
 * @returns Middleware function
 */
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('Access denied: insufficient permissions', 403));
    }
    next();
  };
};
