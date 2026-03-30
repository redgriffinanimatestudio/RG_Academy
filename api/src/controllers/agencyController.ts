import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { success, error } from '../utils/response';
import { AuthRequest } from '../middleware/auth';

export const agencyController = {
  /**
   * Get High-Fidelity Agency Summary (msitarzewski Node)
   */
  async getSummary(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      
      // Calculate aggregate roster stats
      const [rosterCount, activeProjects, totalCommission] = await Promise.all([
        prisma.user.count({ where: { agencyId: userId } }),
        prisma.project.count({ 
          where: { 
            executor: { agencyId: userId },
            status: 'active'
          } 
        }),
        prisma.transaction.aggregate({
          where: { 
            userId,
            type: 'commission'
          },
          _sum: { amount: true }
        })
      ]);

      return success(res, {
        agent: {
          name: "msitarzewski",
          rank: "Master Agent",
          specialization: "High-End VFX & CG talent",
          verified: true
        },
        stats: {
          totalTalent: rosterCount,
          activeContracts: activeProjects,
          totalEarnings: totalCommission._sum.amount || 0,
          performanceIndex: 98
        }
      });
    } catch (e) {
      console.error(e);
      return error(res, 'Agency Summary failed');
    }
  },

  /**
   * Get Talent Roster Matrix
   */
  async getRoster(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const roster = await prisma.user.findMany({
        where: { agencyId: userId },
        select: {
          id: true,
          displayName: true,
          email: true,
          photoURL: true,
          isStudent: true,
          isExecutor: true,
          balance: true,
          createdAt: true
        }
      });
      return success(res, roster);
    } catch (e) {
      return error(res, 'Failed to fetch agency roster');
    }
  }
};
