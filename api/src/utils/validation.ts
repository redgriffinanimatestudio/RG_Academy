import { z } from 'zod';

// --- AUTH SCHEMAS ---

export const RegisterSchema = z.object({
  body: z.object({
    email: z.string().email(),
    displayName: z.string().min(2).max(50),
    role: z.enum(['student', 'lecturer', 'client', 'executor', 'admin', 'hr', 'finance', 'support', 'chief_manager', 'manager', 'moderator', 'artist', 'engineer', 'client_ceo', 'partner', 'community', 'user']).default('student'),
    password: z.string().min(6).optional(),
    phone: z.string().optional(),
    provider: z.string().optional(),
    profileData: z.object({
      country: z.string().optional(),
      citizenship: z.string().optional(),
      linkedInUrl: z.string().optional().or(z.literal('')),
      telegramHandle: z.string().optional(),
      portfolioUrl: z.string().optional().or(z.literal('')),
      bio: z.string().optional(),
      gender: z.enum(['male', 'female', 'other', 'none']).optional(),
      dateOfBirth: z.string().optional(), // ISO string from frontend
    }).optional(),
  }),
});

export const LoginSchema = z.object({
  body: z.object({
    login: z.string().min(3),
    password: z.string().min(3),
  }),
});

export const SwitchRoleSchema = z.object({
  body: z.object({
    role: z.string(),
  }),
});

// --- ACADEMY SCHEMAS ---

export const CreateCourseSchema = z.object({
  body: z.object({
    title: z.string().min(5).max(100),
    description: z.string().min(20),
    categoryId: z.string(),
    programId: z.string().optional(),
    price: z.coerce.number().nonnegative(),
    thumbnail: z.string().url().optional(),
    level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).default('beginner'),
    tags: z.array(z.string()).optional(),
    lod: z.coerce.number().min(100).max(500).default(100),
    softwareStack: z.array(z.object({
      name: z.string(),
      version: z.string()
    })).optional().default([]),
  }),
});

export const CreateModuleSchema = z.object({
  body: z.object({
    courseId: z.string(),
    title: z.string().min(3),
    order: z.coerce.number().int().nonnegative(),
  }),
});

export const EnrollSchema = z.object({
  body: z.object({
    courseId: z.string(),
  }),
});

export const CreateLessonSchema = z.object({
  params: z.object({
    courseId: z.string(),
  }),
  body: z.object({
    title: z.string().min(3),
    content: z.string().min(10),
    videoUrl: z.string().url().optional(),
    type: z.enum(['video', 'text', 'quiz']).default('video'),
    duration: z.coerce.number().optional(),
    order: z.coerce.number().int().nonnegative(),
    isFree: z.boolean().default(false),
    moduleId: z.string().optional(),
  }),
});

export const UpdateAnalyticsSchema = z.object({
  body: z.object({
    enrollmentId: z.string(),
    lessonId: z.string(),
    seconds: z.coerce.number().nonnegative(),
    completed: z.boolean().optional(),
  }),
});

export const UpdateProgressSchema = z.object({
  params: z.object({
    enrollmentId: z.string(),
  }),
  body: z.object({
    progress: z.coerce.number().min(0).max(100),
    completedLessons: z.array(z.string()).optional(),
  }),
});

export const AddReviewSchema = z.object({
  body: z.object({
    courseId: z.string(),
    rating: z.coerce.number().min(1).max(5),
    comment: z.string().max(500).optional(),
  }),
});

export const UpdateWatchTimeSchema = z.object({
  body: z.object({
    enrollmentId: z.string(),
    lessonId: z.string(),
    currentTime: z.coerce.number().nonnegative(),
    duration: z.coerce.number().positive(),
    videoId: z.string().optional(),
  }),
});

export const GetCourseStatusSchema = z.object({
  params: z.object({
    courseId: z.string(),
  }),
});

// --- STUDIO SCHEMAS ---

export const CreateProjectSchema = z.object({
  body: z.object({
    title: z.string().min(5).max(100),
    description: z.string().min(50),
    budget: z.coerce.number().positive(),
    urgency: z.enum(['normal', 'urgent']).default('normal'),
    tags: z.array(z.string()).optional(),
  }),
});

export const SubmitApplicationSchema = z.object({
  body: z.object({
    projectId: z.string(),
    coverLetter: z.string().min(20),
    bid: z.coerce.number().positive(),
  }),
});

export const CreateContractSchema = z.object({
  body: z.object({
    projectId: z.string(),
    executorId: z.string(),
    amount: z.coerce.number().positive(),
    milestones: z.array(z.object({
      title: z.string(),
      amount: z.coerce.number().positive(),
      status: z.string().default('pending'),
    })).min(1),
  }),
});

// --- CHAT SCHEMAS ---

export const CreateRoomSchema = z.object({
  body: z.object({
    type: z.enum(['direct', 'group', 'project']),
    participants: z.array(z.string()).min(1),
    refId: z.string().optional(),
  }),
});

export const SendMessageSchema = z.object({
  params: z.object({
    roomId: z.string(),
  }),
  body: z.object({
    text: z.string().min(1).max(2000),
  }),
});

// --- NOTIFICATION SCHEMAS ---

export const CreateNotificationSchema = z.object({
  body: z.object({
    userId: z.string(),
    type: z.enum(['info', 'success', 'warning', 'error']),
    title: z.string().min(3),
    message: z.string().min(5),
    link: z.string().optional(),
  }),
});
