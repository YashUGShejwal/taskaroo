import mongoose from 'mongoose';
import { AppError } from '../utils/appError';
import logger from '../utils/logger';

export const connectDB = async (retries = 5, delay = 5000): Promise<void> => {
  while (retries) {
    try {
      await mongoose.connect(process.env.MONGODB_URI as string);
      logger.info('MongoDB connected successfully');
      return;
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`MongoDB connection failed: ${error.message}`);
      } else {
        logger.error('MongoDB connection failed with an unknown error');
      }
      retries -= 1;
      logger.warn(`Retries left: ${retries}`);
      if (!retries) throw new AppError('Failed to connect to MongoDB', 500);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
};
