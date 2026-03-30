import { Router } from 'express';
import { academyController } from '../controllers/academyController.js';
import { authMiddleware, requireLecturer, requireAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { 
  CreateCourseSchema, 
  CreateLessonSchema, 
  EnrollSchema, 
  UpdateProgressSchema, 
  AddReviewSchema, 
  CreateModuleSchema, 
  UpdateAnalyticsSchema 
} from '../utils/validation.js';

const router = Router();

// Hierarchy
router.get('/hierarchy', academyController.getHierarchy);
router.get('/categories', academyController.getCategories);
router.get('/calendar', academyController.getCalendar);

// Courses
router.get('/courses', academyController.getCourses);
router.get('/courses/:slug', academyController.getCourseBySlug);
router.get('/courses/:slug/curriculum', academyController.getCourseCurriculum);

// Lecturer/Admin Only: Course Creation & Management
router.post('/courses', 
  authMiddleware, 
  requireLecturer, 
  validate(CreateCourseSchema), 
  academyController.createCourse
);

router.patch('/courses/:courseId/status', 
  authMiddleware, 
  requireLecturer, 
  academyController.updateCourseStatus
);

// Lessons
router.get('/courses/:courseId/lessons', academyController.getLessons);
router.post('/courses/:courseId/lessons', 
  authMiddleware, 
  requireLecturer, 
  validate(CreateLessonSchema), 
  academyController.createLesson
);

router.post('/modules',
  authMiddleware,
  requireLecturer,
  validate(CreateModuleSchema),
  academyController.createModule
);

// Enrollments (Students)
router.post('/enroll', authMiddleware, validate(EnrollSchema), academyController.enroll);
router.get('/progress', authMiddleware, academyController.getStudentProgress); 
router.get('/purchases', authMiddleware, academyController.getStudentPurchases); 
router.get('/users/:userId/enrollments', academyController.getUserEnrollments);
router.patch('/enrollments/:enrollmentId/progress', 
  authMiddleware, 
  validate(UpdateProgressSchema), 
  academyController.updateProgress
);

router.post('/analytics/sync',
  authMiddleware,
  validate(UpdateAnalyticsSchema),
  academyController.syncAnalytics
);

router.get('/enrollments/:enrollmentId/analytics/:lessonId',
  authMiddleware,
  academyController.getPlaybackPosition
);

// Reviews
router.get('/courses/:courseId/reviews', academyController.getCourseReviews);
router.post('/reviews', authMiddleware, validate(AddReviewSchema), academyController.addReview);

export default router;
