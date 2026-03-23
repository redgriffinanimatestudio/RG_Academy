import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { success, error } from '../utils/response';
import { AuthRequest } from '../middleware/auth';

export const notificationController = {
  async getNotifications(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { unreadOnly, limit = '50' } = req.query;

      const where: any = { userId };
      if (unreadOnly === 'true') where.isRead = false;

      const notifications = await prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit as string)
      });

      return success(res, notifications);
    } catch (e) {
      return error(res, 'Failed to fetch notifications');
    }
  },

  async markAsRead(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const notification = await prisma.notification.update({
        where: { id },
        data: { isRead: true }
      });

      return success(res, notification);
    } catch (e) {
      return error(res, 'Failed to update notification');
    }
  },

  async markAllAsRead(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;

      await prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true }
      });

      return success(res, { success: true });
    } catch (e) {
      return error(res, 'Failed to update notifications');
    }
  },

  async createNotification(req: AuthRequest, res: Response) {
    try {
      const { userId, type, title, message, link } = req.body;

      const notification = await prisma.notification.create({
        data: {
          userId,
          type: type || 'info',
          title,
          message,
          link
        }
      });

      return success(res, notification, 201);
    } catch (e) {
      return error(res, 'Failed to create notification');
    }
  },

  async deleteNotification(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      await prisma.notification.delete({ where: { id } });

      return success(res, { deleted: true });
    } catch (e) {
      return error(res, 'Failed to delete notification');
    }
  },

  async getUnreadCount(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const count = await prisma.notification.count({
        where: { userId, isRead: false }
      });

      return success(res, { count });
    } catch (e) {
      return error(res, 'Failed to get unread count');
    }
  }
};
