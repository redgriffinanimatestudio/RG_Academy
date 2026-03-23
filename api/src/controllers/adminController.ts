import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { success, error, paginate } from '../utils/response';
import { AuthRequest } from '../middleware/auth';

export const adminController = {
  // --- DASHBOARD STATS ---
  async getStats(req: Request, res: Response) {
    try {
      const [
        usersCount,
        coursesCount,
        projectsCount,
        contractsCount,
        enrollmentsCount,
        reportsCount,
        notificationsCount
      ] = await Promise.all([
        prisma.user.count(),
        prisma.course.count({ where: { status: 'published' } }),
        prisma.project.count(),
        prisma.contract.count(),
        prisma.enrollment.count(),
        prisma.report.count({ where: { status: 'pending' } }),
        prisma.notification.count({ where: { isRead: false } })
      ]);

      // Revenue calculation (simplified)
      const contracts = await prisma.contract.findMany({
        where: { status: 'completed' },
        select: { amount: true }
      });
      const totalRevenue = contracts.reduce((sum, c) => sum + c.amount, 0);

      // Recent activity
      const recentUsers = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, displayName: true, email: true, createdAt: true }
      });

      return success(res, {
        users: usersCount,
        courses: coursesCount,
        projects: projectsCount,
        contracts: contractsCount,
        enrollments: enrollmentsCount,
        pendingReports: reportsCount,
        unreadNotifications: notificationsCount,
        totalRevenue,
        recentUsers
      });
    } catch (e) {
      return error(res, 'Failed to fetch stats');
    }
  },

  // --- USER MANAGEMENT ---
  async getUsers(req: AuthRequest, res: Response) {
    try {
      const { role, search, page = '1', limit = '20' } = req.query;
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);

      const where: any = {};
      if (role) where.role = role;
      if (search) {
        where.OR = [
          { displayName: { contains: search as string } },
          { email: { contains: search as string } }
        ];
      }

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          include: { profile: { include: { skills: true } } },
          orderBy: { createdAt: 'desc' },
          skip: (pageNum - 1) * limitNum,
          take: limitNum
        }),
        prisma.user.count({ where })
      ]);

      return paginate(res, users, total, pageNum, limitNum);
    } catch (e) {
      return error(res, 'Failed to fetch users');
    }
  },

  async updateUserRole(req: AuthRequest, res: Response) {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      const user = await prisma.user.update({
        where: { id: userId },
        data: { role }
      });

      return success(res, user);
    } catch (e) {
      return error(res, 'Failed to update user role');
    }
  },

  // --- MODERATION ---
  async getReports(req: AuthRequest, res: Response) {
    try {
      const { status = 'pending', page = '1', limit = '20' } = req.query;
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);

      const where: any = {};
      if (status && status !== 'all') where.status = status;

      const [reports, total] = await Promise.all([
        prisma.report.findMany({
          where,
          include: {
            reporter: { select: { id: true, displayName: true, email: true } }
          },
          orderBy: { createdAt: 'desc' },
          skip: (pageNum - 1) * limitNum,
          take: limitNum
        }),
        prisma.report.count({ where })
      ]);

      return paginate(res, reports, total, pageNum, limitNum);
    } catch (e) {
      return error(res, 'Failed to fetch reports');
    }
  },

  async createReport(req: AuthRequest, res: Response) {
    try {
      const { targetType, targetId, reason } = req.body;
      const reporterId = req.user!.id;

      const report = await prisma.report.create({
        data: { reporterId, targetType, targetId, reason, status: 'pending' }
      });

      // Notify admins
      const admins = await prisma.user.findMany({ where: { role: 'admin' } });
      for (const admin of admins) {
        await prisma.notification.create({
          data: {
            userId: admin.id,
            type: 'warning',
            title: 'New Report',
            message: `New ${targetType} report: ${reason.substring(0, 50)}...`,
            link: '/dashboard?view=reports'
          }
        });
      }

      return success(res, report, 201);
    } catch (e) {
      return error(res, 'Failed to create report');
    }
  },

  async updateReportStatus(req: AuthRequest, res: Response) {
    try {
      const { reportId } = req.params;
      const { status } = req.body;

      const report = await prisma.report.update({
        where: { id: reportId },
        data: { status }
      });

      return success(res, report);
    } catch (e) {
      return error(res, 'Failed to update report');
    }
  },

  // --- REVIEWS MODERATION ---
  async getPendingReviews(req: AuthRequest, res: Response) {
    try {
      const reviews = await prisma.review.findMany({
        where: { isApproved: false },
        include: {
          user: { select: { displayName: true, email: true } },
          course: { select: { title: true, slug: true } }
        },
        orderBy: { createdAt: 'desc' }
      });

      return success(res, reviews);
    } catch (e) {
      return error(res, 'Failed to fetch reviews');
    }
  },

  async approveReview(req: AuthRequest, res: Response) {
    try {
      const { reviewId } = req.params;
      const { approved } = req.body;

      if (approved) {
        const review = await prisma.review.update({
          where: { id: reviewId },
          data: { isApproved: true }
        });

        // Update course rating
        const reviews = await prisma.review.findMany({
          where: { courseId: review.courseId, isApproved: true }
        });
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        
        await prisma.course.update({
          where: { id: review.courseId },
          data: { rating: avgRating, reviewsCount: reviews.length }
        });

        return success(res, review);
      } else {
        await prisma.review.delete({ where: { id: reviewId } });
        return success(res, { deleted: true });
      }
    } catch (e) {
      return error(res, 'Failed to process review');
    }
  },

  // --- COURSE MANAGEMENT ---
  async getAllCourses(req: AuthRequest, res: Response) {
    try {
      const { status, page = '1', limit = '20' } = req.query;
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);

      const where: any = {};
      if (status && status !== 'all') where.status = status;

      const [courses, total] = await Promise.all([
        prisma.course.findMany({
          where,
          include: {
            category: true,
            _count: { select: { enrollments: true, reviews: true, lessons: true } }
          },
          orderBy: { createdAt: 'desc' },
          skip: (pageNum - 1) * limitNum,
          take: limitNum
        }),
        prisma.course.count({ where })
      ]);

      return paginate(res, courses.map(c => ({
        ...c,
        tags: JSON.parse(c.tags || '[]')
      })), total, pageNum, limitNum);
    } catch (e) {
      return error(res, 'Failed to fetch courses');
    }
  },

  async updateCourseStatus(req: AuthRequest, res: Response) {
    try {
      const { courseId } = req.params;
      const { status } = req.body;

      const course = await prisma.course.update({
        where: { id: courseId },
        data: { status }
      });

      return success(res, course);
    } catch (e) {
      return error(res, 'Failed to update course status');
    }
  }
};
