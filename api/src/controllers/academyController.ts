import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { success, error, paginate } from '../utils/response';
import { AuthRequest } from '../middleware/auth';

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         id: { type: string }
 *         name: { type: string }
 *         type: { type: string }
 *         order: { type: integer }
 *         subcategories: { type: array, items: { type: object } }
 *     Course:
 *       type: object
 *       properties:
 *         id: { type: string }
 *         slug: { type: string }
 *         title: { type: string }
 *         description: { type: string }
 *         price: { type: number }
 *         level: { type: string }
 *         status: { type: string }
 *         tags: { type: array, items: { type: string } }
 *         studentsCount: { type: integer }
 *         reviewsCount: { type: integer }
 */

export const academyController = {
  /**
   * @swagger
   * /api/categories:
   *   get:
   *     summary: Get all academy categories
   *     tags: [Academy]
   *     responses:
   *       200:
   *         description: List of categories
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items: { $ref: '#/components/schemas/Category' }
   */
  async getCategories(req: Request, res: Response) {
    try {
      const categories = await prisma.category.findMany({
        orderBy: { order: 'asc' },
        include: { _count: { select: { courses: true } } }
      });
      return success(res, categories.map(c => {
        let subcategories = [];
        try { subcategories = JSON.parse(c.subcategories || '[]'); } catch(e) {}
        return { ...c, subcategories };
      }));
    } catch (e) {
      return error(res, 'Database error while fetching categories');
    }
  },

  /**
   * @swagger
   * /api/courses:
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
   *         name: status
   *         schema: { type: string, default: 'published' }
   *     responses:
   *       200:
   *         description: Paginated list of courses
   */
  async getCourses(req: Request, res: Response) {
    try {
      const { category, level, status = 'published', page = '1', limit = '12', search } = req.query;
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      const where: any = {};
      if (status) where.status = status;
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
          include: { category: true, _count: { select: { enrollments: true, reviews: true } } },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limitNum
        }),
        prisma.course.count({ where })
      ]);

      return paginate(res, courses.map(c => {
        let tags = [];
        try { tags = JSON.parse(c.tags || '[]'); } catch(e) {}
        return {
          ...c,
          tags,
          studentsCount: c._count.enrollments,
          reviewsCount: c._count.reviews
        };
      }), total, pageNum, limitNum);
    } catch (e) {
      return error(res, 'Database error while fetching courses');
    }
  },

  /**
   * @swagger
   * /api/courses/{slug}:
   *   get:
   *     summary: Get course details by slug
   *     tags: [Academy]
   *     parameters:
   *       - in: path
   *         name: slug
   *         required: true
   *         schema: { type: string }
   *     responses:
   *       200:
   *         description: Course object with lessons and reviews
   *       404:
   *         description: Course not found
   */
  async getCourseBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const course = await prisma.course.findUnique({
        where: { slug },
        include: {
          category: true,
          lessons: { orderBy: { order: 'asc' } },
          reviews: {
            where: { isApproved: true },
            include: { user: { select: { displayName: true, photoURL: true } } },
            orderBy: { createdAt: 'desc' },
            take: 10
          },
          _count: { select: { enrollments: true, reviews: true } }
        }
      });

      if (!course) return error(res, 'Course not found', 404);

      let tags = [];
      try { tags = JSON.parse(course.tags || '[]'); } catch(e) {}

      return success(res, {
        ...course,
        tags,
        studentsCount: course._count.enrollments,
        reviewsCount: course._count.reviews
      });
    } catch (e) {
      return error(res, 'Failed to fetch course');
    }
  },

  /**
   * @swagger
   * /api/courses:
   *   post:
   *     summary: Create a new course (Lecturer only)
   *     tags: [Academy]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [title, categoryId]
   *             properties:
   *               title: { type: string }
   *               description: { type: string }
   *               categoryId: { type: string }
   *               price: { type: number }
   *     responses:
   *       201:
   *         description: Course created
   */
  async createCourse(req: AuthRequest, res: Response) {
    try {
      const { title, description, categoryId, price, thumbnail, level, tags } = req.body;
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      const course = await prisma.course.create({
        data: {
          title,
          slug: `${slug}-${Date.now()}`,
          description,
          categoryId,
          lecturerId: req.user!.id,
          lecturerName: req.user!.email.split('@')[0],
          price: parseFloat(price) || 0,
          thumbnail: thumbnail || 'https://placehold.co/600x400',
          level: level || 'beginner',
          tags: JSON.stringify(tags || []),
          status: 'draft'
        }
      });

      return success(res, course, 201);
    } catch (e) {
      return error(res, 'Failed to create course');
    }
  },

  // --- LESSONS ---
  async getLessons(req: Request, res: Response) {
    try {
      const { courseId } = req.params;
      const lessons = await prisma.lesson.findMany({
        where: { courseId },
        orderBy: { order: 'asc' }
      });
      return success(res, lessons);
    } catch (e) {
      return error(res, 'Failed to fetch lessons');
    }
  },

  async createLesson(req: AuthRequest, res: Response) {
    try {
      const { courseId } = req.params;
      const { title, content, videoUrl, type, duration, isFree } = req.body;

      const maxOrder = await prisma.lesson.findFirst({
        where: { courseId },
        orderBy: { order: 'desc' }
      });

      const lesson = await prisma.lesson.create({
        data: {
          courseId,
          title,
          content: content || '',
          videoUrl: videoUrl || '',
          type: type || 'video',
          duration: duration || '0m',
          order: (maxOrder?.order || 0) + 1,
          isFree: isFree || false
        }
      });

      return success(res, lesson, 201);
    } catch (e) {
      return error(res, 'Failed to create lesson');
    }
  },

  // --- ENROLLMENTS ---
  async enroll(req: AuthRequest, res: Response) {
    try {
      const { courseId } = req.body;
      const userId = req.user!.id;

      const existing = await prisma.enrollment.findFirst({
        where: { userId, courseId }
      });

      if (existing) {
        return success(res, existing);
      }

      const enrollment = await prisma.enrollment.create({
        data: { userId, courseId, progress: 0, status: 'active', completedLessons: '[]' }
      });

      // Update course student count
      await prisma.course.update({
        where: { id: courseId },
        data: { studentsCount: { increment: 1 } }
      });

      return success(res, enrollment, 201);
    } catch (e) {
      return error(res, 'Failed to enroll');
    }
  },

  async getUserEnrollments(req: AuthRequest, res: Response) {
    try {
      const { userId } = req.params;
      const enrollments = await prisma.enrollment.findMany({
        where: { userId },
        include: {
          course: {
            include: { category: true }
          }
        },
        orderBy: { enrolledAt: 'desc' }
      });

      return success(res, enrollments.map(e => ({
        ...e,
        completedLessons: JSON.parse(e.completedLessons || '[]'),
        course: { ...e.course, tags: JSON.parse(e.course.tags || '[]') }
      })));
    } catch (e) {
      return error(res, 'Failed to fetch enrollments');
    }
  },

  async updateProgress(req: AuthRequest, res: Response) {
    try {
      const { enrollmentId } = req.params;
      const { lessonId, completed } = req.body;

      const enrollment = await prisma.enrollment.findUnique({ where: { id: enrollmentId } });
      if (!enrollment) return error(res, 'Enrollment not found', 404);

      let completedLessons: string[] = JSON.parse(enrollment.completedLessons || '[]');
      
      if (completed && !completedLessons.includes(lessonId)) {
        completedLessons.push(lessonId);
      } else if (!completed) {
        completedLessons = completedLessons.filter(id => id !== lessonId);
      }

      // Calculate progress
      const totalLessons = await prisma.lesson.count({ where: { courseId: enrollment.courseId } });
      const progress = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0;

      const updated = await prisma.enrollment.update({
        where: { id: enrollmentId },
        data: {
          completedLessons: JSON.stringify(completedLessons),
          progress,
          status: progress === 100 ? 'completed' : 'active',
          completedAt: progress === 100 ? new Date() : null
        }
      });

      return success(res, { ...updated, completedLessons });
    } catch (e) {
      return error(res, 'Failed to update progress');
    }
  },

  // --- REVIEWS ---
  async addReview(req: AuthRequest, res: Response) {
    try {
      const { courseId, rating, comment } = req.body;
      const userId = req.user!.id;

      const review = await prisma.review.create({
        data: { courseId, userId, rating: parseInt(rating), comment, isApproved: false }
      });

      return success(res, review, 201);
    } catch (e) {
      return error(res, 'Failed to add review');
    }
  },

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
      return error(res, 'Failed to fetch reviews');
    }
  }
};
