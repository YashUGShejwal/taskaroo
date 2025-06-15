import express from 'express';
import { protect, authorize } from '../middlewares/auth.middleware';
import { getSuperAdminStats } from '../controllers/superadmin.controller';
import logger from '../utils/logger';

const router = express.Router();

/**
 * Middleware to log superadmin route access.
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
router.use((req, res, next) => {
  logger.info(`Superadmin route accessed: ${req.method} ${req.originalUrl}`);
  next();
});

/**
 * @swagger
 * /v1/superadmin/superadminstats:
 *   get:
 *     summary: Get superadmin statistics
 *     tags:
 *       - Superadmin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Superadmin statistics retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/superadminstats', protect, authorize('superadmin'), getSuperAdminStats);

export default router;