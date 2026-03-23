import { Router } from 'express';
import { academyController } from '../controllers/academyController';
import { authMiddleware, optionalAuth } from '../middleware/auth';
import { validateRequest, createCourseSchema, createLessonSchema, enrollSchema, updateProgressSchema, createReviewSchema } from '../utils/validation';

const router = Router();

// Categories
router.get('/categories', academyController.getCategories);

// Courses
router.get('/courses', academyController.getCourses);
router.get('/courses/:slug', academyController.getCourseBySlug);
router.post('/courses', authMiddleware, validateRequest(createCourseSchema), academyController.createCourse);

// Lessons
router.get('/courses/:courseId/lessons', academyController.getLessons);
router.post('/courses/:courseId/lessons', authMiddleware, validateRequest(createLessonSchema), academyController.createLesson);

// Enrollments
router.post('/enroll', authMiddleware, validateRequest(enrollSchema), academyController.enroll);
router.get('/users/:userId/enrollments', academyController.getUserEnrollments);
router.patch('/enrollments/:enrollmentId/progress', authMiddleware, validateRequest(updateProgressSchema), academyController.updateProgress);

// Reviews
router.get('/courses/:courseId/reviews', academyController.getCourseReviews);
router.post('/reviews', authMiddleware, validateRequest(createReviewSchema), academyController.addReview);

export default router;
