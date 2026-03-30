import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { success, error } from '../utils/response';
import { AuthRequest } from '../middleware/auth';

export const systemController = {
  // --- OPERATIONAL HEALTH ---
  async getHealth(req: Request, res: Response) {
    try {
      const metrics = await (prisma as any).systemMetric.findMany({
        take: 20,
        orderBy: { timestamp: 'desc' }
      });
      return success(res, metrics);
    } catch (e) {
      return error(res, 'Failed to fetch system metrics');
    }
  },

  async recordMetric(req: Request, res: Response) {
    try {
      const { type, value, nodeId, status } = req.body;
      const metric = await (prisma as any).systemMetric.create({
        data: { type, value, nodeId, status }
      });
      return success(res, metric, 201);
    } catch (e) {
      return error(res, 'Failed to record system metric');
    }
  },

  // --- AUDIT LOGS (Security & Identity) ---
  async getAuditLogs(req: AuthRequest, res: Response) {
    try {
      const { limit = '50', offset = '0' } = req.query;
      // Fetching from notification or specific event logs
      const logs = await prisma.notification.findMany({
        where: { type: { in: ['warning', 'error', 'info'] } },
        take: parseInt(limit as string),
        skip: parseInt(offset as string),
        orderBy: { createdAt: 'desc' }
      });
      return success(res, logs);
    } catch (e) {
      return error(res, 'Failed to fetch audit logs');
    }
  }
};
