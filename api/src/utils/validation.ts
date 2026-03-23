import { z } from 'zod';

// User validation schemas
export const createUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  displayName: z.string().min(2, 'Display name must be at least 2 characters').max(50),
  remoteId: z.string().min(1, 'Remote ID is required')
});

export const updateProfileSchema = z.object({
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  avatar: z.string().url('Invalid avatar URL').optional(),
  location: z.string().max(100).optional(),
  skills: z.array(z.string()).max(20, 'Maximum 20 skills').optional()
});

// Course validation schemas
export const createCourseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  slug: z.string().min(3, 'Slug must be at least 3 characters').max(100).regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
  price: z.number().min(0, 'Price must be non-negative'),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
  categoryId: z.string().min(1, 'Category is required'),
  thumbnail: z.string().url('Invalid thumbnail URL').optional(),
  duration: z.number().min(1, 'Duration must be at least 1 hour').optional()
});

export const createLessonSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  videoUrl: z.string().url('Invalid video URL').optional(),
  order: z.number().min(1, 'Order must be at least 1'),
  free: z.boolean().default(false)
});

// Enrollment validation
export const enrollSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required')
});

export const updateProgressSchema = z.object({
  progress: z.number().min(0, 'Progress must be non-negative').max(100, 'Progress cannot exceed 100'),
  completed: z.boolean().optional()
});

// Review validation
export const createReviewSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  comment: z.string().min(10, 'Comment must be at least 10 characters').max(1000)
});

// Project validation schemas
export const createProjectSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  slug: z.string().min(3, 'Slug must be at least 3 characters').max(100).regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000),
  budget: z.number().min(0, 'Budget must be non-negative'),
  deadline: z.string().datetime('Invalid deadline format').optional(),
  category: z.string().min(1, 'Category is required'),
  skills: z.array(z.string()).min(1, 'At least one skill is required').max(10)
});

export const createApplicationSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
  bid: z.number().min(0, 'Bid must be non-negative'),
  coverLetter: z.string().min(50, 'Cover letter must be at least 50 characters').max(2000),
  estimatedDays: z.number().min(1, 'Estimated days must be at least 1')
});

// Contract validation
export const createContractSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
  executorId: z.string().min(1, 'Executor ID is required'),
  amount: z.number().min(0, 'Amount must be non-negative'),
  milestones: z.array(z.object({
    title: z.string().min(1, 'Milestone title is required'),
    amount: z.number().min(0, 'Milestone amount must be non-negative'),
    dueDate: z.string().datetime('Invalid due date')
  })).min(1, 'At least one milestone is required')
});

// Task validation
export const createTaskSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().max(1000).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  assignedTo: z.string().optional(),
  dueDate: z.string().datetime('Invalid due date').optional()
});

// Service validation
export const createServiceSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
  category: z.string().min(1, 'Category is required'),
  price: z.number().min(0, 'Price must be non-negative'),
  deliveryTime: z.number().min(1, 'Delivery time must be at least 1 day'),
  skills: z.array(z.string()).min(1, 'At least one skill is required').max(10)
});

// Portfolio validation
export const createPortfolioItemSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000),
  imageUrl: z.string().url('Invalid image URL').optional(),
  projectUrl: z.string().url('Invalid project URL').optional(),
  skills: z.array(z.string()).max(10).optional()
});

// Notification validation
export const createNotificationSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  type: z.enum(['info', 'success', 'warning', 'error', 'contract', 'report']),
  title: z.string().min(1, 'Title is required').max(100),
  message: z.string().min(1, 'Message is required').max(500),
  data: z.record(z.string(), z.any()).optional()
});

// Report validation
export const createReportSchema = z.object({
  type: z.enum(['user', 'review', 'message', 'project']),
  targetId: z.string().min(1, 'Target ID is required'),
  reason: z.string().min(10, 'Reason must be at least 10 characters').max(1000)
});

// Validation middleware helper
export const validateRequest = (schema: z.ZodSchema) => {
  return (req: any, res: any, next: any) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message
          }))
        });
      }
      next(error);
    }
  };
};