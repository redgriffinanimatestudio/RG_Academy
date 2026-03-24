import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';
import prisma from '../utils/prisma';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY 
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    : undefined;

  admin.initializeApp({
    credential: serviceAccount 
      ? admin.credential.cert(serviceAccount)
      : admin.credential.applicationDefault(),
    projectId: process.env.FIREBASE_PROJECT_ID || 'rg-academy-dev'
  });
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    roles?: string[];
  };
}

// Simple token-based auth for development
// In production, integrate with Firebase Admin SDK
export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    
    // Dev token for testing
    if (token === 'DEV_TOKEN_SUPER_ADMIN') {
      const adminUser = await prisma.user.findFirst({ 
        where: { role: 'admin' },
        include: { profile: true }
      });
      if (adminUser) {
        req.user = {
          id: adminUser.id,
          email: adminUser.email || '',
          role: adminUser.role,
          roles: ['admin', 'chief_manager', 'manager', 'moderator', 'hr', 'finance', 'support', 'student', 'lecturer', 'executor', 'client']
        };
        return next();
      }
    }

    // Verify Firebase ID token
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(token);
    } catch (error) {
      return res.status(401).json({ error: 'Invalid Firebase token' });
    }

    // Hardcoded Super Admin check by email
    const superAdminEmail = 'redgriffinanimatestudio@gmail.com';
    const isSuperAdmin = decodedToken.email === superAdminEmail;

    // Get user from database using Firebase UID
    const user = await prisma.user.findUnique({
      where: { remoteId: decodedToken.uid },
      include: { profile: true }
    });

    if (!user && !isSuperAdmin) {
      return res.status(401).json({ error: 'User not found in database' });
    }

    // Role Hierarchy: Admin > Manager > Moderator
    // User roles: student, lecturer, client, executor (independent)
    let role = user?.role || 'student';
    if (isSuperAdmin) role = 'admin';

    const isAdmin = role === 'admin';
    const isManager = role === 'manager' || role === 'chief_manager' || isAdmin;
    const isModerator = role === 'moderator' || isManager;

    const roles: string[] = [];
    if (isAdmin) roles.push('admin');
    if (isManager) roles.push('manager', 'chief_manager');
    if (isModerator) roles.push('moderator');
    
    // Add independent roles from user.roles if they exist
    if (user?.roles) {
      try {
        const parsedRoles = JSON.parse(user.roles);
        if (Array.isArray(parsedRoles)) {
          parsedRoles.forEach(r => {
            if (!roles.includes(r)) roles.push(r);
          });
        }
      } catch (e) {
        console.error('Failed to parse user roles:', e);
      }
    } else if (user?.role && !roles.includes(user.role)) {
      roles.push(user.role);
    }

    // If admin, they get everything
    const finalRoles = isAdmin 
      ? ['admin', 'chief_manager', 'manager', 'moderator', 'hr', 'finance', 'support', 'student', 'lecturer', 'executor', 'client']
      : roles;

    req.user = {
      id: user?.id || 'super-admin-id',
      email: decodedToken.email || user?.email || '',
      role: role,
      roles: finalRoles
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

// Optional auth - doesn't fail if no token
export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      if (token === 'DEV_TOKEN_SUPER_ADMIN') {
        const admin = await prisma.user.findFirst({ where: { role: 'admin' } });
        if (admin) {
          req.user = { id: admin.id, email: admin.email || '', role: admin.role };
        }
      } else {
        try {
          const decodedToken = await admin.auth().verifyIdToken(token);
          const user = await prisma.user.findUnique({ 
            where: { remoteId: decodedToken.uid },
            include: { profile: true }
          });
          if (user) {
            req.user = { id: user.id, email: user.email || decodedToken.email || '', role: user.role };
          }
        } catch {
          // Invalid token, continue without auth
        }
      }
    }
    
    next();
  } catch {
    next();
  }
};

// Role-based access control
export const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userRoles = req.user.roles || [req.user.role];
    const hasRole = roles.some(role => userRoles.includes(role));

    if (!hasRole) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

export const requireAdmin = requireRole('admin', 'chief_manager');
export const requireModerator = requireRole('admin', 'chief_manager', 'manager', 'moderator');
export const requireStaff = requireRole('admin', 'chief_manager', 'manager', 'moderator', 'hr', 'finance', 'support');
