import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth.js';
import prisma from '../utils/prisma.js';
import { error } from '../utils/response.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    roles: string[];
    // Role Flags for RBAC Bridge
    isStudent: boolean;
    isLecturer: boolean;
    isClient: boolean;
    isExecutor: boolean;
    isHr: boolean;
    isFinance: boolean;
    isSupport: boolean;
    isAgency: boolean;
    isAdmin: boolean;
  };
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return error(res, 'Authorization header missing or malformed', 401);
  }

  const token = authHeader.split(' ')[1];
  const decoded: any = verifyToken(token);

  if (!decoded) {
    return error(res, 'Invalid or expired token', 401);
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user) {
      return error(res, 'User no longer exists', 401);
    }

    // Attach user info with deep RBAC flags to request
    req.user = {
      id: user.id,
      email: user.email || '',
      role: user.role,
      roles: JSON.parse(user.roles || '["student"]'),
      isStudent: user.isStudent,
      isLecturer: user.isLecturer,
      isClient: user.isClient,
      isExecutor: user.isExecutor,
      isHr: user.isHr,
      isFinance: user.isFinance,
      isAgency: user.isAgency,
      isSupport: user.isSupport,
      isAdmin: user.isAdmin
    };

    next();
  } catch (e) {
    return error(res, 'Authentication internal error', 500);
  }
};

export const checkRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return error(res, 'Unauthorized', 401);

    // Admin has super-access across all roles
    if (req.user.isAdmin) return next();

    // Check against active role and broad permissions
    const hasRole = allowedRoles.includes(req.user.role);
    
    if (!hasRole) {
      return error(res, `Forbidden: Requires one of [${allowedRoles.join(', ')}] roles`, 403);
    }
    
    next();
  };
};

// Specialized RBAC Middlewares for Phase 2 readiness
export const requireLecturer = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) return error(res, 'Unauthorized', 401);
  if (!req.user.isAdmin && !req.user.isLecturer) {
    return error(res, 'Forbidden: Lecturer access required', 403);
  }
  next();
};

export const requireClient = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) return error(res, 'Unauthorized', 401);
  if (!req.user.isAdmin && !req.user.isClient) {
    return error(res, 'Forbidden: Client access required', 403);
  }
  next();
};

export const requireExecutor = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) return error(res, 'Unauthorized', 401);
  if (!req.user.isAdmin && !req.user.isExecutor) {
    return error(res, 'Forbidden: Executor access required', 403);
  }
  next();
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || !req.user.isAdmin) {
    return error(res, 'Forbidden: Admin access required', 403);
  }
  next();
};

export const requireStaff = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) return error(res, 'Unauthorized', 401);
  const isStaff = req.user.isAdmin || req.user.isHr || req.user.isFinance || req.user.isSupport;
  if (!isStaff) {
    return error(res, 'Forbidden: Staff access required', 403);
  }
  next();
};

export const requireModerator = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) return error(res, 'Unauthorized', 401);
  const isModerator = req.user.isAdmin || req.user.roles.includes('moderator') || req.user.roles.includes('manager');
  if (!isModerator) {
    return error(res, 'Forbidden: Moderator access required', 403);
  }
  next();
};
