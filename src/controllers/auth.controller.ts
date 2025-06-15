import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user.model';
import { generateToken } from '../services/auth.service';
import { AppError } from '../utils/appError';

// Controllers
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, role } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return next(new AppError('Email already exists', 400));

    const user = await User.create({ name, email, password, role });
    res.status(201).json({ token: generateToken(user) });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError('Invalid email or password', 401));
    }

    res.json({ token: generateToken(user) });
  } catch (err) {
    next(err);
  }
};
