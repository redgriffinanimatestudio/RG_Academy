import { Request, Response } from 'express';
import prisma from '../utils/prisma.js';
import { success, error } from '../utils/response.js';
import { AuthRequest } from '../middleware/auth.js';

export const authController = {
  async devLogin(req: Request, res: Response) {
    try {
      const { login, password } = req.body;
      const isPrivileged = (login === 'admin' && password === 'admin') || login === 'superadmin';
      const isStandard = login === 'user' && password === 'user';

      if (!isPrivileged && !isStandard) {
        return error(res, 'Invalid credentials', 401);
      }

      const email = isPrivileged ? 'admin@redgriffin.academy' : 'user@example.com';
      const displayName = isPrivileged ? 'Super Admin' : 'Test User';
      const primaryRole = isPrivileged ? 'admin' : 'student';

      let user = await prisma.user.findUnique({
        where: { email },
        include: { profile: true }
      });

      const ALL_ROLES = ['admin', 'student', 'lecturer', 'client', 'executor', 'chief_manager', 'manager', 'moderator'];

      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            displayName,
            role: primaryRole,
            primaryRole,
            isAdmin: isPrivileged,
            isStudent: true,
            isLecturer: isPrivileged,
            isClient: isPrivileged,
            isExecutor: isPrivileged,
            roles: isPrivileged ? JSON.stringify(ALL_ROLES) : JSON.stringify(['student']),
            source: 'local',
            profile: { create: { bio: 'System Account' } }
          },
          include: { profile: true }
        });
      } else if (isPrivileged) {
        // Ensure existing admin has all roles
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            isAdmin: true,
            roles: JSON.stringify(ALL_ROLES)
          },
          include: { profile: true }
        });
      }

      const rolesArray = JSON.parse(user.roles || '["student"]');

      return success(res, {
        token: `DEV_TOKEN_${user.id}`,
        user: { ...user, roles: rolesArray }
      });
    } catch (e) {
      console.error('Login error:', e);
      return error(res, 'Authentication failed', 500);
    }
  },

  async me(req: AuthRequest, res: Response) {
    try {
      if (!req.user) return error(res, 'Not authenticated', 401);
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: { profile: true }
      });
      if (!user) return error(res, 'User not found', 404);
      
      const rolesArray = JSON.parse(user.roles || '["student"]');
      return success(res, { ...user, roles: rolesArray });
    } catch (e) {
      return error(res, 'Failed to get user', 500);
    }
  },

  async switchRole(req: AuthRequest, res: Response) {
    try {
      const { role } = req.body;
      const userId = req.user!.id;

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) return error(res, 'User not found', 404);

      // Check permissions: Admin can switch to ANY role.
      // Other users can only switch to roles they possess in their 'roles' array.
      const rolesArray = JSON.parse(user.roles || '["student"]');
      const isAllowed = user.isAdmin || rolesArray.includes(role);

      if (!isAllowed) {
        return error(res, `Permission denied for role: ${role}`, 403);
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { role },
        include: { profile: true }
      });

      return success(res, { ...updatedUser, roles: rolesArray });
    } catch (e) {
      console.error('Role switch error:', e);
      return error(res, 'Internal server error', 500);
    }
  },

  async getUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await prisma.user.findUnique({
        where: { id },
        include: { profile: true }
      });
      if (!user) return error(res, 'User not found', 404);
      const rolesArray = JSON.parse(user.roles || '["student"]');
      return success(res, { ...user, roles: rolesArray });
    } catch (e) {
      return error(res, 'Failed to get user', 500);
    }
  },

  async syncUser(req: Request, res: Response) {
    try {
      const { email, displayName, remoteId, photoURL } = req.body;
      let user = await prisma.user.upsert({
        where: { email },
        update: { remoteId, photoURL, displayName },
        create: { 
          email, 
          displayName, 
          remoteId, 
          photoURL, 
          role: 'student', 
          primaryRole: 'student',
          isStudent: true,
          roles: JSON.stringify(['student'])
        }
      });
      const rolesArray = JSON.parse(user.roles || '["student"]');
      return success(res, { ...user, roles: rolesArray });
    } catch (e) {
      return error(res, 'Failed to sync user', 500);
    }
  }
};
