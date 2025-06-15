import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';
import logger from '../utils/logger';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const message = `Route not found: ${req.originalUrl}`;
  logger.warn(message);
  next(new AppError(message, 404));
};

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let { statusCode, message } = err;

  if (!(err instanceof AppError)) {
    statusCode = 500;
    message = 'Internal Server Error';
  }

  logger.error(`Error: ${message} | Status Code: ${statusCode}`);

  res.status(statusCode).json({
    status: 'error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
