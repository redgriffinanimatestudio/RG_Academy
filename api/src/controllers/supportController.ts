import { Request, Response } from 'express';
import prisma from '../utils/prisma.js';
import { success, error } from '../utils/response';
import { AuthRequest } from '../middleware/auth';

export const supportController = {
  // --- REPORTS & TICKETS ---
  async createReport(req: AuthRequest, res: Response) {
    try {
      const { targetType, targetId, reason } = req.body;
      const reporterId = req.user!.id;

      const report = await (prisma as any).report.create({
        data: { 
          reporterId, 
          targetType: targetType || 'general', 
          targetId: targetId || 'support', 
          reason, 
          status: 'pending' 
        }
      });

      return success(res, report, 201);
    } catch (e) {
      return error(res, 'Failed to create support ticket');
    }
  },

  async getReports(req: AuthRequest, res: Response) {
    try {
      const { status } = req.query;
      const reports = await prisma.report.findMany({
        where: status ? { status: status as string } : {},
        include: {
          reporter: {
            select: { displayName: true, email: true, photoURL: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
      return success(res, reports);
    } catch (e) {
      return error(res, 'Failed to fetch support reports');
    }
  },

  async resolveReport(req: AuthRequest, res: Response) {
    try {
      const { reportId } = req.params;
      const { status } = req.body; // resolved, dismissed

      if (!['resolved', 'dismissed', 'pending'].includes(status)) {
        return error(res, 'Invalid status', 400);
      }

      const report = await prisma.report.update({
        where: { id: reportId },
        data: { status }
      });
      return success(res, report);
    } catch (e) {
      return error(res, 'Failed to update report status');
    }
  },

  async deleteReport(req: AuthRequest, res: Response) {
    try {
      const { reportId } = req.params;
      await prisma.report.delete({
        where: { id: reportId }
      });
      return success(res, { deleted: true });
    } catch (e) {
      return error(res, 'Failed to delete report');
    }
  }
};
