import { 
  Shield, Target, LayoutDashboard, ShieldCheck, Users, 
  DollarSign, LifeBuoy, GraduationCap, Video, Box, Briefcase 
} from 'lucide-react';

export const ROLES = [
  { id: 'admin', label: 'Admin', icon: Shield, color: '#ef4444' },
  { id: 'chief_manager', label: 'Chief Manager', icon: Target, color: '#7f77dd' },
  { id: 'manager', label: 'Manager', icon: LayoutDashboard, color: '#1d9e75' },
  { id: 'moderator', label: 'Moderator', icon: ShieldCheck, color: '#ef9f27' },
  { id: 'hr', label: 'HR Lead', icon: Users, color: '#378add' },
  { id: 'finance', label: 'Finance', icon: DollarSign, color: '#1d9e75' },
  { id: 'support', label: 'Support', icon: LifeBuoy, color: '#7f77dd' },
  { id: 'student', label: 'Student', icon: GraduationCap, color: '#378add' },
  { id: 'lecturer', label: 'Instructor', icon: Video, color: '#1d9e75' },
  { id: 'client', label: 'Client', icon: Box, color: '#ef9f27' },
  { id: 'executor', label: 'Specialist', icon: Briefcase, color: '#e24b4a' }
];

export const MATRIX_DATA = [
  { g: 'users', section: 'User Management' },
  { g: 'users', label: 'View all users', sub: 'GET /api/admin/users', cm: 1, mg: 1, mo: 2 },
  { g: 'users', label: 'Full user profile', sub: 'GET /api/admin/users/:id', cm: 1, mg: 1, mo: 1 },
  { g: 'users', label: 'Assign/remove roles', sub: 'PATCH /api/admin/users/:id/role', cm: 1, mg: 0, mo: 0 },
  { g: 'users', label: 'Suspend account', sub: 'PATCH /api/admin/users/:id/suspend', cm: 1, mg: 1, mo: 1 },

  { g: 'content', section: 'Content Moderation' },
  { g: 'content', label: 'View all courses (draft)', sub: 'GET /api/admin/courses', cm: 1, mg: 1, mo: 1 },
  { g: 'content', label: 'Handle reports', sub: 'PATCH /api/admin/reports/:reportId', cm: 1, mg: 1, mo: 1 },
  { g: 'content', label: 'Approve reviews', sub: 'PATCH /api/admin/reviews/:reviewId/approve', cm: 1, mg: 1, mo: 1 },

  { g: 'finance', section: 'Finance & Treasury' },
  { g: 'finance', label: 'System revenue stats', sub: 'GET /api/admin/stats', cm: 1, mg: 0, mo: 0 },
  { g: 'finance', label: 'Initiate refund', sub: 'POST /api/admin/finance/refund/:id', cm: 1, mg: 0, mo: 2 },
];

export const API_ENDPOINTS = [
  { 
    tag: 'Auth & Profile', 
    endpoints: [
      { method: 'POST', path: '/api/auth/sync', desc: 'Sync Secure user with DB', body: '{\n  "uid": "abc...",\n  "email": "user@example.com",\n  "displayName": "John Doe",\n  "photoURL": "..."\n}' },
      { method: 'GET', path: '/api/auth/me', desc: 'Get current session profile' },
      { method: 'GET', path: '/api/auth/users/:id', desc: 'Get public user data' },
      { method: 'POST', path: '/api/auth/dev/auth', desc: 'Developer backdoor login', body: '{\n  "login": "admin",\n  "password": "admin"\n}' }
    ]
  },
  { 
    tag: 'Academy Engine', 
    endpoints: [
      { method: 'GET', path: '/api/academy/categories', desc: 'List course categories' },
      { method: 'GET', path: '/api/academy/courses', desc: 'Get all active workshops' },
      { method: 'GET', path: '/api/academy/courses/:slug', desc: 'Get workshop details' },
      { method: 'POST', path: '/api/academy/courses', desc: 'Create new course', body: '{\n  "title": "Mastering 3D",\n  "desc": "...",\n  "categoryId": "..."\n}' },
      { method: 'POST', path: '/api/academy/enroll', desc: 'Join a workshop', body: '{\n  "courseId": "uuid..."\n}' },
      { method: 'GET', path: '/api/academy/users/:userId/enrollments', desc: 'Get user progress' },
      { method: 'PATCH', path: '/api/academy/enrollments/:id/progress', desc: 'Update lesson progress', body: '{\n  "completedLessons": ["uuid..."]\n}' },
      { method: 'POST', path: '/api/academy/reviews', desc: 'Add course review', body: '{\n  "courseId": "...",\n  "rating": 5,\n  "comment": "Great!"\n}' }
    ]
  },
  { 
    tag: 'Studio & Production', 
    endpoints: [
      { method: 'GET', path: '/api/studio/projects', desc: 'Browse studio project board' },
      { method: 'POST', path: '/api/studio/projects', desc: 'Create production project', body: '{\n  "title": "CGI Film",\n  "budget": 5000\n}' },
      { method: 'POST', path: '/api/studio/applications', desc: 'Apply for project as executor' },
      { method: 'GET', path: '/api/studio/contracts', desc: 'Get active session contracts' },
      { method: 'POST', path: '/api/studio/contracts', desc: 'Generate production contract', body: '{\n  "projectId": "...",\n  "executorId": "...",\n  "amount": 1500\n}' },
      { method: 'PATCH', path: '/api/studio/contracts/:id', desc: 'Update milestone / status' }
    ]
  },
  { 
    tag: 'Admin & Control', 
    endpoints: [
      { method: 'GET', path: '/api/admin/stats', desc: 'Platform KPI overview' },
      { method: 'GET', path: '/api/admin/users', desc: 'Manage user directory' },
      { method: 'PATCH', path: '/api/admin/users/:userId/role', desc: 'Elevate/Demote user' },
      { method: 'GET', path: '/api/admin/reports', desc: 'Get moderation queue' },
      { method: 'PATCH', path: '/api/admin/reports/:reportId', desc: 'Resolve safety ticket' },
      { method: 'GET', path: '/api/admin/reviews/pending', desc: 'Moderation review stream' },
      { method: 'PATCH', path: '/api/admin/courses/:courseId/status', desc: 'Approve/Reject workshop' }
    ]
  },
  { 
    tag: 'Networking Feed', 
    endpoints: [
      { method: 'GET', path: '/api/networking/profiles/:userId', desc: 'Get specialist profile' },
      { method: 'POST', path: '/api/networking/portfolio', desc: 'Add work to portfolio', body: '{\n  "title": "Orc Sculpt",\n  "imageUrl": "..."\n}' },
      { method: 'POST', path: '/api/networking/connections', desc: 'Follow user', body: '{\n  "followingId": "..."\n}' },
      { method: 'GET', path: '/api/networking/feed/:userId', desc: 'Get social activity stream' },
      { method: 'GET', path: '/api/networking/discovery/search', desc: 'Deep talent search' }
    ]
  },
  { 
    tag: 'Notifications', 
    endpoints: [
      { method: 'GET', path: '/api/notifications/:userId', desc: 'Get user notification inbox' },
      { method: 'GET', path: '/api/notifications/:userId/unread-count', desc: 'Get bubble count' },
      { method: 'PATCH', path: '/api/notifications/:id/read', desc: 'Mark single notification' },
      { method: 'POST', path: '/api/notifications/mark-all-read', desc: 'Clear all inbox' },
      { method: 'POST', path: '/api/notifications/', desc: 'Broadcast global system alert' }
    ]
  }
];
