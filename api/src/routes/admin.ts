import { Router } from 'express';
import { adminController } from '../controllers/adminController';
import { authMiddleware, requireAdmin, requireModerator, requireStaff } from '../middleware/auth.js';

const router = Router();

// Dashboard
router.get('/stats', authMiddleware, requireStaff, adminController.getStats);
router.get('/ecosystem-stats', authMiddleware, requireAdmin, adminController.getEcosystemStats);

// User Management
router.get('/users', authMiddleware, requireStaff, adminController.getUsers);
router.post('/users', authMiddleware, requireAdmin, adminController.createUser);
router.put('/users/:userId', authMiddleware, requireAdmin, adminController.updateUser);
router.patch('/users/:userId/role', authMiddleware, requireAdmin, adminController.updateUserRole);

// Moderation
router.get('/reports', authMiddleware, requireModerator, adminController.getReports);
router.post('/reports', authMiddleware, adminController.createReport);
router.patch('/reports/:reportId', authMiddleware, requireModerator, adminController.updateReportStatus);

// Reviews Moderation
router.get('/reviews/pending', authMiddleware, requireModerator, adminController.getPendingReviews);
router.patch('/reviews/:reviewId/approve', authMiddleware, requireModerator, adminController.approveReview);

// Course Management
router.get('/courses', authMiddleware, requireStaff, adminController.getAllCourses);
router.patch('/courses/:courseId/status', authMiddleware, requireModerator, adminController.updateCourseStatus);

export default router;
