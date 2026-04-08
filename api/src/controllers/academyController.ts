import { Request, Response } from 'express';
import { success, error, paginate } from '../utils/response.js';
import prisma from '../utils/prisma.js';
import { AuthRequest, requireAdmin, requireLecturer } from '../middleware/auth.js';
import { notifyUser } from '../utils/socket.js';
import { ACADEMIC_TREE } from '../config/academic.js';
import { 
  CourseCreateInputSchema, 
  LessonCreateInputSchema,
  EnrollmentCreateInputSchema,
  ReviewCreateInputSchema,
  CourseUpdateInputSchema
} from '../schemas/generated/index.js';
import { z } from 'zod';

/**
 * @swagger
 * tags:
 *   name: Academy
 *   description: Course management and learning platform
 */

export const academyController = {
  /**
   * @swagger
   * /api/v1/academy/categories:
   *   get:
   *     summary: Get all academy categories
   *     tags: [Academy]
   */
  async getCategories(req: Request, res: Response) {
    try {
      const categories = await prisma.category.findMany({
        orderBy: { order: 'asc' },
        include: { _count: { select: { courses: true } } }
      });
      return success(res, categories.map(c => ({
        ...c, subcategories: JSON.parse(c.subcategories || '[]')
      })));
    } catch (e) {
      return error(res, 'Database error');
    }
  },

  /**
   * @swagger
   * /api/v1/academy/hierarchy:
   *   get:
   *     summary: Get full university academic hierarchy
   *     tags: [Academy]
   */
  async getHierarchy(req: Request, res: Response) {
    try {
      return success(res, ACADEMIC_TREE);
    } catch (e) {
      return error(res, 'Fetch error');
    }
  },

  /**
   * @swagger
   * /api/v1/academy/courses:
   *   get:
   *     summary: Get all courses with filters
   *     tags: [Academy]
   *     parameters:
   *       - in: query
   *         name: category
   *         schema: { type: string }
   *       - in: query
   *         name: level
   *         schema: { type: string }
   *       - in: query
   *         name: search
   *         schema: { type: string }
   */
  async getCourses(req: Request, res: Response) {
    try {
      const { category, level, status = 'published', page = '1', limit = '12', search } = req.query;
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      const where: any = { status };
      if (category) where.categoryId = category;
      if (level) where.level = level;
      if (search) {
        where.OR = [
          { title: { contains: search as string } },
          { description: { contains: search as string } }
        ];
      }

      const [courses, total] = await Promise.all([
        prisma.course.findMany({
          where,
          include: { 
            category: true, 
            program: true,
            _count: { select: { enrollments: true, reviews: true } } 
          },
          orderBy: { createdAt: 'desc' },
          skip, take: limitNum
        }),
        prisma.course.count({ where })
      ]);

      return paginate(res, courses.map(c => ({
        ...c, 
        tags: JSON.parse(c.tags || '[]'),
        softwareStack: JSON.parse(c.softwareStack || '[]'),
        whatYouWillLearn: JSON.parse(c.whatYouWillLearn || '[]'),
        requirements: JSON.parse(c.requirements || '[]'),
        targetAudience: JSON.parse(c.targetAudience || '[]'),
        studentsCount: c._count.enrollments,
        reviewsCount: c._count.reviews
      })), total, pageNum, limitNum);
    } catch (e) {
      return error(res, 'Database error');
    }
  },

  /**
   * @swagger
   * /api/v1/academy/courses/{slug}:
   *   get:
   *     summary: Get course details
   *     tags: [Academy]
   *     parameters:
   *       - in: path
   *         name: slug
   *         required: true
   *         schema: { type: string }
   */
  async getCourseBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const course = await prisma.course.findUnique({
        where: { slug },
        include: {
          category: true,
          program: true,
          modules: {
            orderBy: { order: 'asc' },
            include: { lessons: { orderBy: { order: 'asc' } } }
          },
          lessons: { where: { moduleId: null }, orderBy: { order: 'asc' } }, // Lessons without module
          reviews: { where: { isApproved: true }, take: 10 },
          _count: { select: { enrollments: true, reviews: true } }
        }
      });

      if (!course) return error(res, 'Course not found', 404);

      return success(res, {
        ...course, 
        tags: JSON.parse(course.tags || '[]'),
        softwareStack: JSON.parse(course.softwareStack || '[]'),
        whatYouWillLearn: JSON.parse(course.whatYouWillLearn || '[]'),
        requirements: JSON.parse(course.requirements || '[]'),
        targetAudience: JSON.parse(course.targetAudience || '[]'),
        studentsCount: course._count.enrollments,
        reviewsCount: course._count.reviews
      });
    } catch (e) {
      return error(res, 'Fetch error');
    }
  },

  async getCourseCurriculum(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const course = await prisma.course.findUnique({
        where: { slug },
        select: { id: true }
      });
      if (!course) return error(res, 'Course not found', 404);

      const modules = await prisma.module.findMany({
        where: { courseId: course.id },
        orderBy: { order: 'asc' },
        include: {
          lessons: {
            orderBy: { order: 'asc' }
          }
        }
      });
      return success(res, modules);
    } catch (e) {
      return error(res, 'Failed to fetch curriculum');
    }
  },

  // --- ACADEMIC CALENDAR ---
  async getCalendar(req: Request, res: Response) {
    try {
      const { start, end } = req.query;
      const where: any = {};
      if (start) where.startTime = { gte: new Date(start as string) };
      if (end) where.endTime = { lte: new Date(end as string) };
      const events = await prisma.schedule.findMany({ where, orderBy: { startTime: 'asc' } });
      return success(res, events);
    } catch (e) {
      return error(res, 'Failed to fetch calendar');
    }
  },

  /**
   * @swagger
   * /api/v1/academy/enroll:
   *   post:
   *     summary: Enroll in course
   *     tags: [Academy]
   *     security:
   *       - bearerAuth: []
   */
  async enroll(req: AuthRequest, res: Response) {
    try {
      const { courseId } = (EnrollmentCreateInputSchema as any).pick({ courseId: true }).parse(req.body);
      
      const enrollment = await prisma.enrollment.create({
        data: { userId: req.user!.id, courseId, progress: 0, status: 'active', completedLessons: '[]' }
      });
      return success(res, enrollment, 201);
    } catch (e) {
      return error(res, 'Enrollment failed');
    }
  },

  /**
   * @swagger
   * /api/v1/academy/courses:
   *   post:
   *     summary: Create new course (Staff/Lecturer only)
   *     tags: [Academy]
   *     security:
   *       - bearerAuth: []
   */
  async createCourse(req: AuthRequest, res: Response) {
    try {
      const validatedData = CourseCreateInputSchema.parse(req.body);
      const { 
        title, slug, description, categoryId, programId, 
        level, price, thumbnail, tags, lecturerId, lecturerName,
        lod, softwareStack
      } = validatedData as any;
      
      const course = await prisma.course.create({
        data: {
          title, slug, description, categoryId, programId, level, price, thumbnail,
          tags: JSON.stringify(tags || []),
          softwareStack: JSON.stringify(softwareStack || []),
          lod: lod || 100,
          lecturerId, lecturerName,
          status: 'draft'
        }
      });
      return success(res, course, 201);
    } catch (e) {
      return error(res, 'Course creation failed');
    }
  },

  /**
   * @swagger
   * /api/v1/academy/courses/{courseId}/lessons:
   *   get:
   *     summary: Get all lessons for a specific course
   *     tags: [Academy]
   */
  async getLessons(req: Request, res: Response) {
    try {
      const { courseId } = req.params;
      const lessons = await prisma.lesson.findMany({
        where: { courseId },
        orderBy: { order: 'asc' }
      });
      return success(res, lessons);
    } catch (e) {
      return error(res, 'Fetch error');
    }
  },

  /**
   * @swagger
   * /api/v1/academy/courses/{courseId}/lessons:
   *   post:
   *     summary: Add a lesson to a course
   *     tags: [Academy]
   *     security:
   *       - bearerAuth: []
   */
  async createLesson(req: AuthRequest, res: Response) {
    try {
      const { courseId } = req.params;
      const validatedData = LessonCreateInputSchema.parse(req.body);
      const { title, content, videoUrl, type, duration, order, isFree, moduleId } = validatedData as any;
      
      const lesson = await prisma.lesson.create({
        data: { courseId, title, content, videoUrl, type, duration, order, isFree, moduleId }
      });
      return success(res, lesson, 201);
    } catch (e) {
      return error(res, 'Lesson creation failed');
    }
  },

  async createModule(req: AuthRequest, res: Response) {
    try {
      const { courseId, title, order } = req.body;
      const module = await prisma.module.create({
        data: { courseId, title, order: parseInt(order) }
      });
      return success(res, module, 201);
    } catch (e) {
      return error(res, 'Module creation failed');
    }
  },

  async syncAnalytics(req: AuthRequest, res: Response) {
    try {
      const { enrollmentId, lessonId, seconds, completed } = req.body;
      const analyticsId = `${enrollmentId}_${lessonId}`;

      const analytics = await prisma.enrollmentAnalytics.upsert({
        where: { id: analyticsId },
        update: { 
          watchTime: seconds, // Set current bookmark
          completedAt: completed ? new Date() : undefined,
          lastSyncAt: new Date()
        },
        create: {
          id: analyticsId,
          enrollmentId,
          lessonId,
          watchTime: seconds,
          completedAt: completed ? new Date() : null
        }
      });

      // Phase 17: Notify dashboard for real-time sync
      notifyUser(req.user!.id, 'STUDENT_PROGRESS_UPDATE', { 
        lessonId, 
        completed,
        timestamp: new Date().toISOString()
      });

      return success(res, analytics);
    } catch (e) {
      return error(res, 'Analytics sync failed');
    }
  },

  async getPlaybackPosition(req: AuthRequest, res: Response) {
    try {
      const { enrollmentId, lessonId } = req.params;
      const analytics = await prisma.enrollmentAnalytics.findUnique({
        where: { id: `${enrollmentId}_${lessonId}` }
      });
      return success(res, analytics || { watchTime: 0 });
    } catch (e) {
      return error(res, 'Failed to fetch playback position');
    }
  },

  /**
   * @swagger
   * /api/v1/academy/users/{userId}/enrollments:
   *   get:
   *     summary: Get all courses a user is enrolled in
   *     tags: [Academy]
   */
  async getUserEnrollments(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const enrollments = await prisma.enrollment.findMany({
        where: { userId },
        include: { course: true }
      });
      return success(res, enrollments);
    } catch (e) {
      return error(res, 'Fetch error');
    }
  },

  /**
   * @swagger
   * /api/v1/academy/enrollments/{enrollmentId}/progress:
   *   patch:
   *     summary: Update lesson completion progress
   *     tags: [Academy]
   *     security:
   *       - bearerAuth: []
   */
  async updateProgress(req: AuthRequest, res: Response) {
    try {
      const { enrollmentId } = req.params;
      const { progress, completedLessons } = req.body;
      const enrollment = await prisma.enrollment.update({
        where: { id: enrollmentId, userId: req.user!.id },
        data: { progress, completedLessons: JSON.stringify(completedLessons || []) }
      });

      // Phase 17: Notify dashboard for real-time sync
      notifyUser(req.user!.id, 'STUDENT_PROGRESS_UPDATE', { 
        progress,
        syncAt: new Date().toISOString()
      });

      return success(res, enrollment);
    } catch (e) {
      return error(res, 'Update failed');
    }
  },

  /**
   * @swagger
   * /api/v1/academy/courses/{courseId}/reviews:
   *   get:
   *     summary: Get all approved reviews for a course
   *     tags: [Academy]
   */
  async getCourseReviews(req: Request, res: Response) {
    try {
      const { courseId } = req.params;
      const reviews = await prisma.review.findMany({
        where: { courseId, isApproved: true },
        include: { user: { select: { displayName: true, photoURL: true } } },
        orderBy: { createdAt: 'desc' }
      });
      return success(res, reviews);
    } catch (e) {
      return error(res, 'Fetch error');
    }
  },

  /**
   * @swagger
   * /api/v1/academy/reviews:
   *   post:
   *     summary: Post a new review for a course
   *     tags: [Academy]
   *     security:
   *       - bearerAuth: []
   */
  async addReview(req: AuthRequest, res: Response) {
    try {
      const { courseId, rating, comment } = (ReviewCreateInputSchema as any).pick({ courseId: true, rating: true, comment: true }).parse(req.body);
      
      const review = await prisma.review.create({
        data: { userId: req.user!.id, courseId, rating, comment, isApproved: false }
      });
      return success(res, review, 201);
    } catch (e) {
      return error(res, 'Review failed');
    }
  },

  async getStudentProgress(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const enrollments = await prisma.enrollment.findMany({
        where: { userId },
        include: {
          course: {
            include: { category: true }
          }
        },
        orderBy: { enrolledAt: 'desc' }
      });

      return success(res, { 
        enrollments, 
        stats: {
          total: enrollments.length,
          completed: enrollments.filter(e => e.status === 'completed').length,
          avgProgress: enrollments.length > 0 
            ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length) 
            : 0,
          gpa: 4.8
        }
      });
    } catch (e) {
      return error(res, 'Failed to fetch progress');
    }
  },

  async getStudentPurchases(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const transactions = await prisma.transaction.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });
      return success(res, transactions);
    } catch (e) {
      return error(res, 'Failed to fetch purchases');
    }
  },

  /**
   * @swagger
   * /api/v1/academy/courses/{courseId}/status:
   *   patch:
   *     summary: Update course status (Lecturer/Staff only)
   *     tags: [Academy]
   *     security:
   *       - bearerAuth: []
   */
  async updateCourseStatus(req: AuthRequest, res: Response) {
    try {
      const { courseId } = req.params;
      const { status } = req.body;

      const course = await prisma.course.findUnique({ where: { id: courseId } });
      if (!course) return error(res, 'Course not found', 404);

      if (course.lecturerId !== req.user!.id && req.user!.role !== 'admin') {
        return error(res, 'Unauthorized', 403);
      }

      const updated = await prisma.course.update({
        where: { id: courseId },
        data: { status }
      });

      return success(res, updated);
    } catch (e) {
      return error(res, 'Update failed');
    }
  },

  async updateWatchTime(req: AuthRequest, res: Response) {
    try {
      const { enrollmentId, lessonId, currentTime, duration, videoId } = req.body;
      
      const analyticsId = `${enrollmentId}_${lessonId}`;
      const watchedSeconds = Math.floor(currentTime);
      const completionPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
      const isCompleted = completionPercent >= 90;

      const analytics = await prisma.enrollmentAnalytics.upsert({
        where: { id: analyticsId },
        update: { 
          watchTime: watchedSeconds,
          completedAt: isCompleted ? new Date() : undefined,
          lastSyncAt: new Date()
        },
        create: {
          id: analyticsId,
          enrollmentId,
          lessonId,
          watchTime: watchedSeconds,
          completedAt: isCompleted ? new Date() : null
        }
      });

      if (isCompleted) {
        const enrollment = await prisma.enrollment.findUnique({
          where: { id: enrollmentId }
        });
        
        if (enrollment) {
          const completedLessons: string[] = JSON.parse(enrollment.completedLessons || '[]');
          if (!completedLessons.includes(lessonId)) {
            completedLessons.push(lessonId);
            
            const totalLessons = await prisma.lesson.count({
              where: { courseId: enrollment.courseId }
            });
            
            const progress = totalLessons > 0 
              ? Math.round((completedLessons.length / totalLessons) * 100) 
              : 0;

            const isCourseCompleted = progress >= 100;
            
            await prisma.enrollment.update({
              where: { id: enrollmentId },
              data: {
                completedLessons: JSON.stringify(completedLessons),
                progress,
                status: isCourseCompleted ? 'completed' : 'active',
                completedAt: isCourseCompleted ? new Date() : undefined
              }
            });

            notifyUser(req.user!.id, 'LESSON_COMPLETED', {
              lessonId,
              courseId: enrollment.courseId,
              progress,
              completedAt: new Date().toISOString()
            });
          }
        }
      }

      notifyUser(req.user!.id, 'WATCH_TIME_UPDATE', {
        lessonId,
        currentTime: watchedSeconds,
        duration,
        percentWatched: completionPercent
      });

      return success(res, { 
        ...analytics,
        percentWatched: Math.round(completionPercent),
        isCompleted
      });
    } catch (e) {
      return error(res, 'Watch time update failed');
    }
  },

  async getCourseStatus(req: AuthRequest, res: Response) {
    try {
      const { courseId } = req.params;
      const userId = req.user!.id;

      const enrollment = await prisma.enrollment.findFirst({
        where: { userId, courseId }
      });

      if (!enrollment) {
        return success(res, { status: 'not_started', progress: 0, completedLessons: [] });
      }

      const totalLessons = await prisma.lesson.count({
        where: { courseId }
      });

      const completedLessons: string[] = JSON.parse(enrollment.completedLessons || '[]');
      const progress = totalLessons > 0 
        ? Math.round((completedLessons.length / totalLessons) * 100) 
        : 0;

      let status: 'not_started' | 'in_progress' | 'completed';
      if (enrollment.status === 'completed' || progress >= 100) {
        status = 'completed';
      } else if (progress > 0) {
        status = 'in_progress';
      } else {
        status = 'not_started';
      }

      return success(res, {
        status,
        progress,
        completedLessons,
        totalLessons,
        enrolledAt: enrollment.enrolledAt,
        completedAt: enrollment.completedAt
      });
    } catch (e) {
      return error(res, 'Failed to get course status');
    }
  },

  async getProgressHistory(req: AuthRequest, res: Response) {
    try {
      const { courseId } = req.params;
      const userId = req.user!.id;

      const enrollment = await prisma.enrollment.findFirst({
        where: { userId, courseId }
      });

      if (!enrollment) {
        return success(res, { lessons: [], milestones: [] });
      }

      const analytics = await prisma.enrollmentAnalytics.findMany({
        where: { enrollmentId: enrollment.id },
        orderBy: { lastSyncAt: 'asc' }
      });

      const lessonMap = new Map<string, { watchTime: number; completedAt: Date | null }>();
      
      for (const a of analytics) {
        const existing = lessonMap.get(a.lessonId);
        if (!existing || a.lastSyncAt > (existing.completedAt || new Date(0))) {
          lessonMap.set(a.lessonId, {
            watchTime: a.watchTime,
            completedAt: a.completedAt
          });
        }
      }

      const lessons = Array.from(lessonMap.entries()).map(([lessonId, data]) => ({
        lessonId,
        watchTime: data.watchTime,
        completedAt: data.completedAt,
        completed: !!data.completedAt
      }));

      const milestones = [];
      if (enrollment.enrolledAt) {
        milestones.push({ event: 'enrolled', date: enrollment.enrolledAt });
      }
      if (enrollment.completedAt) {
        milestones.push({ event: 'course_completed', date: enrollment.completedAt });
      }

      for (const a of analytics) {
        if (a.completedAt) {
          const alreadyAdded = milestones.find(m => 
            m.event === 'lesson_completed' && 
            new Date(m.date).getTime() === new Date(a.completedAt!).getTime()
          );
          if (!alreadyAdded) {
            milestones.push({ 
              event: 'lesson_completed', 
              date: a.completedAt,
              lessonId: a.lessonId 
            });
          }
        }
      }

      return success(res, {
        lessons,
        milestones: milestones.sort((a, b) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        ),
        overallProgress: enrollment.progress,
        status: enrollment.status
      });
    } catch (e) {
      return error(res, 'Failed to get progress history');
    }
  }
};
