import express from 'express';
import { protect, authorize } from '../middlewares/auth.middleware';
import { getReports } from '../controllers/admin.controller';
import logger from '../utils/logger';

const router = express.Router();

router.use((req, res, next) => {
  logger.info(`Admin route accessed: ${req.method} ${req.originalUrl}`);
  next();
});

/**
 * @swagger
 * /v1/admin/reports:
 *   get:
 *     summary: Get admin reports
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin reports retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/reports', protect, authorize('admin'), getReports);

export default router;