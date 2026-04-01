import { Router } from 'express';
import { notificationController } from '../controllers/notificationController.js';
import { authMiddleware } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { CreateNotificationSchema } from '../utils/validation.js';

const router = Router();

// Get notifications for user
router.get('/', authMiddleware, notificationController.getNotifications);
router.get('/:userId', notificationController.getNotifications);
router.get('/:userId/unread-count', notificationController.getUnreadCount);

// Mark as read
router.patch('/:id/read', notificationController.markAsRead);
router.post('/mark-all-read', authMiddleware, notificationController.markAllAsRead);

// Admin: create notification
router.post('/', authMiddleware, validate(CreateNotificationSchema), notificationController.createNotification);
router.delete('/:id', authMiddleware, notificationController.deleteNotification);

export default router;
