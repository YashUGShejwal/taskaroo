import jwt, { SignOptions } from 'jsonwebtoken';
import { IUser } from '../models/user.model';

const jwtSecret = process.env.JWT_SECRET;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN ? parseInt(process.env.JWT_EXPIRES_IN, 10) : undefined;

if (!jwtSecret) throw new Error('JWT_SECRET is not defined');
if (!jwtExpiresIn) throw new Error('JWT_EXPIRES_IN is not defined');

const signOptions: SignOptions = {
  expiresIn: jwtExpiresIn,
};

export const generateToken = (user: IUser): string => {
  try {
    return jwt.sign(
      { id: user._id, role: user.role },
      jwtSecret,
      signOptions
    );
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to generate token: ${error.message}`);
    }
    throw new Error('Failed to generate token due to an unknown error');
  }
};
