import { Request, Response } from 'express';
import prisma from '../utils/prisma.js';
import { success, error } from '../utils/response.js';

export const authController = {
  async devLogin(req: Request, res: Response) {
    try {
      const { login, password } = req.body;
      const isPrivileged = login === 'admin' && password === 'admin';
      const isStandard = login === 'user' && password === 'user';

      if (!isPrivileged && !isStandard) {
        return error(res, 'Invalid credentials', 401);
      }

      const email = isPrivileged ? 'super@redgriffin.academy' : 'user@example.com';
      const displayName = isPrivileged ? 'Super Admin' : 'Test User';
      const role = isPrivileged ? 'admin' : 'student';

      let user = await prisma.user.findUnique({
        where: { email },
        include: { profile: true }
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            displayName,
            role,
            roles: isPrivileged ? JSON.stringify(['admin', 'chief_manager', 'manager', 'moderator', 'hr', 'finance', 'support', 'student', 'lecturer', 'executor', 'client']) : JSON.stringify(['student']),
            source: 'local',
            profile: { create: { bio: 'System Account' } }
          },
          include: { profile: true }
        });
      }

      return success(res, {
        token: `DEV_TOKEN_${user.id}`,
        user: { ...user, roles: isPrivileged ? ['admin', 'chief_manager', 'manager', 'moderator', 'hr', 'finance', 'support', 'student', 'lecturer', 'executor', 'client'] : [user.role] }
      });
    } catch (e) {
      console.error('Login error:', e);
      return error(res, 'Authentication failed', 500);
    }
  },

  async me(req: any, res: Response) {
    try {
      if (!req.user) return error(res, 'Not authenticated', 401);
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: { profile: true }
      });
      if (!user) return error(res, 'User not found', 404);
      return success(res, { ...user, roles: req.user.roles || [user.role] });
    } catch (e) {
      return error(res, 'Failed to get user', 500);
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
      return success(res, user);
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
        create: { email, displayName, remoteId, photoURL, role: 'student' }
      });
      return success(res, user);
    } catch (e) {
      return error(res, 'Failed to sync user', 500);
    }
  }
};
