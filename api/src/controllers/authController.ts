import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { success, error } from '../utils/response';
import { AuthRequest } from '../middleware/auth';

export const authController = {
  // Dev backdoor login
  async devLogin(req: Request, res: Response) {
    try {
      const { login, password } = req.body;
      const allowedDevPairs = [
        { login: 'user', password: 'user' },
        { login: 'admin', password: 'admin' }
      ];

      if (!allowedDevPairs.some((x) => x.login === login && x.password === password)) {
        return error(res, 'Invalid credentials', 401);
      }

      // Find or create superuser
      let superUser = await prisma.user.findUnique({
        where: { email: 'super@redgriffin.academy' },
        include: { profile: { include: { skills: true } } }
      });

      if (!superUser) {
        superUser = await prisma.user.create({
          data: {
            email: 'super@redgriffin.academy',
            displayName: 'Super Admin',
            role: 'admin',
            source: 'local',
            profile: {
              create: {
                bio: 'Superuser account for local development',
                location: 'Localhost'
              }
            }
          },
          include: { profile: { include: { skills: true } } }
        });
      } else {
        // Ensure role is admin for backdoor access
        if (superUser.role !== 'admin') {
          superUser = await prisma.user.update({
            where: { id: superUser.id },
            data: { role: 'admin' },
            include: { profile: { include: { skills: true } } }
          });
        }
      }

      const payloadUser = {
        ...superUser,
        roles: ['admin', 'chief_manager', 'manager', 'moderator', 'hr', 'finance', 'support', 'student', 'lecturer', 'executor', 'client']
      };

      return success(res, {
        token: 'DEV_TOKEN_SUPER_ADMIN',
        user: payloadUser
      });
    } catch (e) {
      console.error('Dev login error:', e);
      return error(res, 'Authentication failed');
    }
  },

  // Sync user from Firebase
  async syncUser(req: Request, res: Response) {
    try {
      const { remoteId, email, displayName, photoURL } = req.body;

      if (!remoteId || !email) {
        return error(res, 'remoteId and email are required', 400);
      }

      // Check if user exists by remoteId
      let user = await prisma.user.findUnique({
        where: { remoteId },
        include: { profile: { include: { skills: true } } }
      });

      if (user) {
        // Update existing user
        user = await prisma.user.update({
          where: { remoteId },
          data: {
            email,
            displayName,
            photoURL,
            lastSyncedAt: new Date()
          },
          include: { profile: { include: { skills: true } } }
        });
      } else {
        // Check by email
        user = await prisma.user.findUnique({
          where: { email },
          include: { profile: { include: { skills: true } } }
        });

        if (user) {
          // Link existing email user to Firebase
          user = await prisma.user.update({
            where: { email },
            data: {
              remoteId,
              displayName: displayName || user.displayName,
              photoURL: photoURL || user.photoURL,
              source: 'firebase',
              lastSyncedAt: new Date()
            },
            include: { profile: { include: { skills: true } } }
          });
        } else {
          // Create new user
          user = await prisma.user.create({
            data: {
              remoteId,
              email,
              displayName,
              photoURL,
              role: 'student',
              source: 'firebase',
              lastSyncedAt: new Date()
            },
            include: { profile: { include: { skills: true } } }
          });

          // Create default profile
          await prisma.profile.create({
            data: { userId: user.id }
          });
        }
      }

      return success(res, {
        token: remoteId,
        user
      });
    } catch (e) {
      console.error(e);
      return error(res, 'Failed to sync user');
    }
  },

  // Get current user
  async me(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return error(res, 'Not authenticated', 401);
      }

      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: { profile: { include: { skills: true } } }
      });

      if (!user) {
        return error(res, 'User not found', 404);
      }

      return success(res, user);
    } catch (e) {
      return error(res, 'Failed to get user');
    }
  },

  // Get user by ID or remoteId
  async getUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      let user = await prisma.user.findFirst({
        where: {
          OR: [
            { id: id },
            { remoteId: id }
          ]
        },
        include: { profile: { include: { skills: true, portfolio: true } } }
      });

      if (!user) {
        return error(res, 'User not found', 404);
      }

      return success(res, user);
    } catch (e) {
      return error(res, 'Failed to get user');
    }
  }
};
