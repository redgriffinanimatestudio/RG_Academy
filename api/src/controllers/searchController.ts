import { Request, Response } from 'express';
import prisma from '../utils/prisma.js';
import { success, error } from '../utils/response.js';
import { AuthRequest } from '../middleware/auth.js';

export const searchController = {
  /**
   * Universal Search: Queries all major platform entities
   */
  async unifiedSearch(req: AuthRequest, res: Response) {
    try {
      const q = req.query.q as string;
      if (!q || q.length < 2) return success(res, { courses: [], projects: [], profiles: [], services: [] });

      const isClient = req.user?.isClient || req.user?.isAdmin;

      // Parallel Execution for Performance
      const [courses, projects, profiles, services] = await Promise.all([
        // 1. Academy Courses
        prisma.course.findMany({
          where: {
            OR: [
              { title: { contains: q, } },
              { description: { contains: q, } }
            ],
            status: 'published'
          },
          take: 5,
          include: { category: true }
        }),

        // 2. Studio Projects
        prisma.project.findMany({
          where: {
            OR: [
              { title: { contains: q, } },
              { description: { contains: q, } }
            ],
            status: 'open'
          },
          take: 5,
          include: { client: { select: { displayName: true, photoURL: true } } }
        }),

        // 3. User Profiles (Partial Visibility for Guests/Non-Clients)
        prisma.profile.findMany({
          where: {
            OR: [
              { specialization: { contains: q, } },
              { bio: { contains: q, } },
              { user: { displayName: { contains: q, } } }
            ]
          },
          take: 5,
          include: { 
            user: { select: { displayName: true, photoURL: true, isExecutor: true } },
            skills: { include: { skill: true } }
          }
        }),

        // 4. Studio Services
        prisma.service.findMany({
          where: {
            OR: [
              { title: { contains: q, } },
              { category: { contains: q, } }
            ]
          },
          take: 5,
          include: { executor: { select: { displayName: true, photoURL: true } } }
        })
      ]);

      // Apply Restrictions to Profiles (Step 13 - Partial View)
      const sanitizedProfiles = (profiles as any[]).map(p => ({
        id: p.id,
        displayName: p.user?.displayName,
        photoURL: p.user?.photoURL,
        specialization: p.specialization,
        skills: p.skills?.map((s: any) => s.skill?.name) || [],
        // Restricted fields
        availability: isClient ? p.availability : "Restricted",
        hourlyRate: isClient ? p.hourlyRate : 0,
        isExecutor: p.user?.isExecutor
      }));

      return success(res, {
        courses,
        projects,
        profiles: sanitizedProfiles,
        services,
        query: q
      });
    } catch (e) {
      console.error("[Search] Unified Search Error:", e);
      return error(res, 'Discovery engine failed', 500);
    }
  },

  /**
   * Semantic Discovery: Logic in aiController handles the heavy lifting
   */
  async aiDiscover(req: AuthRequest, res: Response) {
    try {
      // Logic for AI discovery is integrated in aiController
      return success(res, { suggestions: ["Explore Revit Mastery", "Hire Top Maya Artists", "Path: CG Lead"] });
    } catch (e) {
      return error(res, 'AI Discovery failed');
    }
  }
};
