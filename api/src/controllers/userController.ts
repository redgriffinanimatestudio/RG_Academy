import { Response } from 'express';
import prisma from '../utils/prisma';
import { success, error } from '../utils/response';
import { AuthRequest } from '../middleware/auth';

export const userController = {
  async getSynergyStats(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { role } = req.query; // Активная роль, переданная с фронта

      let stats: any = {};

      switch (role) {
        case 'student':
          const enrollments = await prisma.enrollment.findMany({
            where: { userId },
            include: { course: true },
            orderBy: { enrolledAt: 'desc' },
            take: 1
          });
          const totalEnrollments = await prisma.enrollment.count({ where: { userId } });
          const achievements = await prisma.achievement.count({ where: { userId } });
          
          stats = {
            primary: enrollments[0] || null, // Последний курс
            count: totalEnrollments,
            extra: achievements,
            label: 'Workshops',
            extraLabel: 'Achievements'
          };
          break;

        case 'lecturer':
          const courses = await prisma.course.findMany({
            where: { lecturerId: userId },
            include: { _count: { select: { enrollments: true } } }
          });
          const totalStudents = courses.reduce((acc, c) => acc + c._count.enrollments, 0);
          const totalRevenue = courses.reduce((acc, c) => acc + (c.price * c._count.enrollments), 0);

          stats = {
            primary: courses[0] || null,
            count: courses.length,
            extra: totalStudents,
            revenue: totalRevenue,
            label: 'Your Workshops',
            extraLabel: 'Total Students'
          };
          break;

        case 'client':
          const projects = await prisma.project.count({ where: { clientId: userId } });
          const activeContracts = await prisma.contract.count({ 
            where: { clientId: userId, status: 'active' } 
          });
          stats = {
            count: projects,
            extra: activeContracts,
            label: 'Projects Posted',
            extraLabel: 'Active Contracts'
          };
          break;

        case 'executor':
          const assignments = await prisma.project.count({ where: { executorId: userId } });
          const services = await prisma.service.count({ where: { executorId: userId } });
          stats = {
            count: assignments,
            extra: services,
            label: 'Jobs Taken',
            extraLabel: 'Services Listed'
          };
          break;

        default:
          stats = { message: 'General community member' };
      }

      return success(res, stats);
    } catch (e) {
      console.error(e);
      return error(res, 'Failed to fetch synergy stats');
    }
  }
};
