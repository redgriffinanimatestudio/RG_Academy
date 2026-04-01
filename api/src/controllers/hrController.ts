import { Request, Response } from 'express';
import prisma from '../utils/prisma.js';
import { success, error } from '../utils/response';
import { AuthRequest } from '../middleware/auth';

export const hrController = {
  // --- JOB OPENINGS ---
  async getOpenings(req: Request, res: Response) {
    try {
      const { status = 'open' } = req.query;
      const openings = await (prisma as any).jobOpening.findMany({
        where: { status: status as string },
        orderBy: { createdAt: 'desc' }
      });
      return success(res, openings);
    } catch (e) {
      return error(res, 'Failed to fetch job openings');
    }
  },

  async createOpening(req: AuthRequest, res: Response) {
    try {
      const { title, department, description, requirements, salaryRange } = req.body;
      const opening = await (prisma as any).jobOpening.create({
        data: {
          title,
          department,
          description,
          requirements: JSON.stringify(requirements || []),
          salaryRange,
          status: 'open'
        }
      });
      return success(res, opening, 201);
    } catch (e) {
      return error(res, 'Failed to create job opening');
    }
  },

  // --- APPLICANTS (HR recruitment) ---
  async getApplicants(req: AuthRequest, res: Response) {
    try {
      const { openingId } = req.query;
      const applicants = await (prisma as any).jobApplication.findMany({
        where: openingId ? { openingId: openingId as string } : {},
        include: {
          user: {
            select: { id: true, displayName: true, email: true, photoURL: true, role: true }
          },
          opening: {
            select: { title: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
      return success(res, applicants);
    } catch (e) {
      return error(res, 'Failed to fetch applicants');
    }
  },

  async submitApplication(req: AuthRequest, res: Response) {
    try {
      const { openingId, coverLetter, resumeUrl } = req.body;
      const userId = req.user!.id;

      // Ensure opening exists
      const opening = await (prisma as any).jobOpening.findUnique({
        where: { id: openingId }
      });

      if (!opening) return error(res, 'Job opening not found', 404);
      if (opening.status !== 'open') return error(res, 'Job opening is no longer active', 400);

      // check for duplicate application
      const existing = await (prisma as any).jobApplication.findFirst({
        where: { userId, openingId }
      });
      if (existing) return error(res, 'You have already applied for this position', 409);

      const application = await (prisma as any).jobApplication.create({
        data: {
          userId,
          openingId,
          coverLetter,
          resumeUrl,
          status: 'pending'
        }
      });

      return success(res, application, 201);
    } catch (e) {
      return error(res, 'Failed to submit application');
    }
  },

  async updateStatus(req: AuthRequest, res: Response) {
    try {
      const { appId } = req.params;
      const { status } = req.body; // pending, reviewed, hired, rejected
      
      const application = await (prisma as any).jobApplication.update({
        where: { id: appId },
        data: { status }
      });

      return success(res, application);
    } catch (e) {
      return error(res, 'Failed to update application status');
    }
  },

  /**
   * Get High-Fidelity HR Summary (Talent Matrix)
   */
  async getSummary(req: AuthRequest, res: any) {
    try {
      const [openings, applicants, activeLearners] = await Promise.all([
        (prisma as any).jobOpening.count({ where: { status: 'open' } }),
        (prisma as any).jobApplication.count(),
        prisma.user.count({ where: { isStudent: true } })
      ]);

      const talentFunnels = await (prisma as any).jobApplication.groupBy({
        by: ['status'],
        _count: { id: true }
      });

      return success(res, {
        stats: {
          totalOpenings: openings,
          totalApplicants: applicants,
          activeTalentPool: activeLearners,
          recruitmentHealth: 92 // High-fidelity mock
        },
        funnels: talentFunnels.map((f: any) => ({ name: f.status, value: f._count.id }))
      });
    } catch (e) {
      console.error(e);
      return error(res, 'HR Summary failed');
    }
  }
};
