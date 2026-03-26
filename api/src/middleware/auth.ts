import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    roles?: string[];
  };
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const SUPER_ADMIN_EMAIL = 'super@redgriffin.academy';
    
    let user;

    // 1. Проверяем, не системный ли это токен
    if (token.startsWith('DEV_TOKEN_')) {
      const userId = token.replace('DEV_TOKEN_', '');
      user = await prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true }
      });
    } else {
      // 2. Ищем по remoteId или email (для совместимости)
      user = await prisma.user.findFirst({
        where: {
          OR: [
            { remoteId: token },
            { email: token.includes('@') ? token : '____none____' }
          ]
        },
        include: { profile: true }
      });
    }

    // 3. Обработка Superadmin (даже если пользователя нет в БД, создаем виртуального для отказоустойчивости)
    const isSuperAdmin = user?.email === SUPER_ADMIN_EMAIL || token === 'DEV_TOKEN_SUPER_ADMIN';

    if (!user && !isSuperAdmin) {
      return res.status(401).json({ error: 'User not found or invalid token' });
    }

    // 4. Мапинг ролей
    const ALL_ROLES = ['admin', 'chief_manager', 'manager', 'moderator', 'hr', 'finance', 'support', 'student', 'lecturer', 'executor', 'client'];
    
    let finalRoles: string[] = [];
    if (isSuperAdmin || user?.role === 'admin') {
      finalRoles = ALL_ROLES;
    } else {
      try {
        finalRoles = user?.roles ? JSON.parse(user.roles) : [user?.role || 'student'];
      } catch (e) {
        finalRoles = [user?.role || 'student'];
      }
    }

    req.user = {
      id: user?.id || 'super-admin-id',
      email: user?.email || SUPER_ADMIN_EMAIL,
      role: isSuperAdmin ? 'admin' : (user?.role || 'student'),
      roles: finalRoles
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ error: 'Internal Server Error during authentication' });
  }
};

export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const userId = token.replace('DEV_TOKEN_', '');
      
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { id: userId },
            { remoteId: token },
            { email: token.includes('@') ? token : '____none____' }
          ]
        }
      });
      
      if (user) {
        req.user = { 
          id: user.id, 
          email: user.email || '', 
          role: user.role,
          roles: user.roles ? JSON.parse(user.roles) : [user.role]
        };
      }
    }
    next();
  } catch {
    next();
  }
};

export const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: 'Authentication required' });
    const userRoles = req.user.roles || [req.user.role];
    const hasRole = roles.some(role => userRoles.includes(role));
    if (!hasRole) return res.status(403).json({ error: 'Insufficient permissions' });
    next();
  };
};

export const requireAdmin = requireRole('admin', 'chief_manager');
export const requireModerator = requireRole('admin', 'chief_manager', 'manager', 'moderator');
export const requireStaff = requireRole('admin', 'chief_manager', 'manager', 'moderator', 'hr', 'finance', 'support');
