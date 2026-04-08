import { Request, Response } from 'express';
import prisma from '../utils/prisma.js';
import { success, error } from '../utils/response.js';
import { AuthRequest } from '../middleware/auth.js';

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: High-fidelity analytics for the Command Center
 */

export const dashboardController = {
  /**
   * Internal logic for reusable student summary calculation
   */
  async calculateStudentSummary(userId: string) {
    // 1. Fetch Enrollments with Course LOD and Levels
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            thumbnail: true,
            level: true,
            lod: true,
            softwareStack: true
          }
        }
      },
      orderBy: { enrolledAt: 'desc' }
    });

    // 2. Fetch Grades for GPA Calculation
    const grades = await prisma.grade.findMany({
      where: { submission: { userId } },
      select: { score: true }
    });

    // 3. Fetch Earned Certificates
    const certificates = await prisma.certificate.findMany({
      where: { userId },
      include: { course: { select: { title: true, thumbnail: true } } },
      orderBy: { issuedAt: 'desc' }
    });

    // 4. Calculate Analytics
    const totalEnrollments = enrollments.length;
    const completedEnrollments = enrollments.filter(e => e.status === 'completed').length;
    
    const avgProgress = totalEnrollments > 0 
      ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / totalEnrollments) 
      : 0;

    // GPA Calculation (5.0 scale)
    const gpa = grades.length > 0
      ? parseFloat((grades.reduce((sum, g) => sum + g.score, 0) / grades.length / 20).toFixed(2)) // Assuming score is 0-100
      : 0;

    // Skill Points (XP) Calculation
    const xp = enrollments.reduce((sum, e) => sum + (e.progress * (e.course.lod / 100)), 0);

    // 5. Aggregate Tech Stack LODs
    const techStack: Record<string, number> = {};
    enrollments.forEach(e => {
      const software = JSON.parse(e.course.softwareStack || '[]');
      software.forEach((s: any) => {
        const currentLevel = techStack[s.name] || 100;
        techStack[s.name] = Math.max(currentLevel, 100 + (e.progress * 3)); // Growth algorithm
      });
    });

    return {
      enrollments: enrollments.map(e => ({
        ...e,
        course: {
          ...e.course,
          softwareStack: JSON.parse(e.course.softwareStack || '[]')
        }
      })),
      stats: {
        totalEnrollments,
        completedEnrollments,
        avgProgress,
        gpa: gpa || 0,
        xp: Math.round(xp),
        rank: xp > 500 ? 'Industrialist' : 'Initiate'
      },
      certificates: certificates.map(c => ({
        ...c,
        issuedAt: c.issuedAt.toISOString()
      })),
      techStack: Object.entries(techStack).map(([name, lod]) => ({ name, lod }))
    };
  },

  /**
   * @swagger
   * /api/v1/dashboard/student/summary:
   *   get:
   *     summary: Get aggregated student analytics for V2 Command Center
   *     tags: [Dashboard]
   *     security:
   *       - bearerAuth: []
   */
  async getStudentSummary(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const summary = await this.calculateStudentSummary(userId);
      return success(res, summary);
    } catch (e) {
      console.error('[Dashboard Engine] Summary Failed:', e);
      return error(res, 'Failed to assemble Command Center telemetry');
    }
  }
};
