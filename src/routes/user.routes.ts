import express from 'express';
import { userFeature, adminFeature } from '../controllers/user.controller';
import { protect, authorize } from '../middlewares/auth.middleware';

const router = express.Router();

/**
 * @swagger
 * /v1/users/user-feature:
 *   get:
 *     summary: Access user-only feature
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User-only feature accessed successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/user-feature', protect, authorize('user', 'admin'), userFeature);

/**
 * @swagger
 * /v1/users/admin-feature:
 *   get:
 *     summary: Access admin-only feature
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin-only feature accessed successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/admin-feature', protect, authorize('admin'), adminFeature);

export default router;