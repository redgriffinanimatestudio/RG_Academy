import { Request, Response } from 'express';
import prisma from '../utils/prisma.js';
import { success, error } from '../utils/response.js';
import { AuthRequest } from '../middleware/auth.js';

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: User notification system
 */

export const notificationController = {
  /**
   * @swagger
   * /api/notifications:
   *   get:
   *     summary: Get user notifications
   *     tags: [Notifications]
   *     security:
   *       - bearerAuth: []
   */
  async getNotifications(req: AuthRequest, res: Response) {
    try {
      const notifications = await prisma.notification.findMany({
        where: { userId: req.user!.id },
        orderBy: { createdAt: 'desc' }
      });
      return success(res, notifications);
    } catch (e) {
      return error(res, 'Database error');
    }
  },

  /**
   * @swagger
   * /api/notifications/{id}/read:
   *   patch:
   *     summary: Mark notification as read
   *     tags: [Notifications]
   *     security:
   *       - bearerAuth: []
   */
  async markAsRead(req: AuthRequest, res: Response) {
    try {
      await prisma.notification.update({
        where: { id: req.params.id },
        data: { isRead: true }
      });
      return success(res, { success: true });
    } catch (e) {
      return error(res, 'Update failed');
    }
  },

  async getUnreadCount(req: Request, res: Response) {
    try {
      const count = await prisma.notification.count({
        where: { userId: req.params.userId, isRead: false }
      });
      return success(res, { count });
    } catch (e) {
      return error(res, 'Database error');
    }
  },

  async markAllAsRead(req: AuthRequest, res: Response) {
    try {
      await prisma.notification.updateMany({
        where: { userId: req.user!.id, isRead: false },
        data: { isRead: true }
      });
      return success(res, { success: true });
    } catch (e) {
      return error(res, 'Update failed');
    }
  },

  async createNotification(req: AuthRequest, res: Response) {
    try {
      const { userId, type, title, message, link } = req.body;
      const notification = await prisma.notification.create({
        data: { userId, type, title, message, link }
      });
      return success(res, notification, 201);
    } catch (e) {
      return error(res, 'Creation failed');
    }
  },

  async deleteNotification(req: AuthRequest, res: Response) {
    try {
      await prisma.notification.delete({ where: { id: req.params.id } });
      return success(res, { deleted: true });
    } catch (e) {
      return error(res, 'Deletion failed');
    }
  }
};
