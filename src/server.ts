import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file

import app from './app';
import { connectDB } from './config/db.config';
import logger from './utils/logger';

const PORT = process.env.PORT || 5000;

process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error(`Failed to connect to the database: ${err.message}`);
    process.exit(1);
  });

process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err}`);
  process.exit(1);
});