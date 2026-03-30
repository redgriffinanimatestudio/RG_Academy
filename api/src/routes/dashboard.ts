import { Router } from 'express';
import { dashboardController } from '../controllers/dashboardController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

/**
 * @swagger
 * /api/v1/dashboard/student/summary:
 *   get:
 *     summary: Get student Command Center analytics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 */
router.get('/student/summary', authMiddleware, dashboardController.getStudentSummary);

export default router;
