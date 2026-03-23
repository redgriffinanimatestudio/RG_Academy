import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { success, error, paginate } from '../utils/response';
import { AuthRequest } from '../middleware/auth';

export const networkingController = {
  // --- PROFILES ---
  async getProfile(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      
      const profile = await prisma.profile.findUnique({
        where: { userId },
        include: {
          user: { select: { id: true, displayName: true, photoURL: true, email: true, role: true } },
          skills: true,
          portfolio: { orderBy: { createdAt: 'desc' } }
        }
      });

      if (!profile) {
        // Return user info even without profile
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { id: true, displayName: true, photoURL: true, email: true, role: true }
        });
        if (!user) return error(res, 'User not found', 404);
        return success(res, { userId, user, skills: [], portfolio: [] });
      }

      return success(res, profile);
    } catch (e) {
      return error(res, 'Failed to fetch profile');
    }
  },

  async updateProfile(req: AuthRequest, res: Response) {
    try {
      const { userId, bio, avatar, location, skills } = req.body;
      const targetUserId = userId || req.user!.id;

      // Upsert profile
      let profile = await prisma.profile.upsert({
        where: { userId: targetUserId },
        create: {
          userId: targetUserId,
          bio,
          avatar,
          location
        },
        update: {
          ...(bio !== undefined && { bio }),
          ...(avatar !== undefined && { avatar }),
          ...(location !== undefined && { location })
        }
      });

      // Update skills if provided
      if (skills && Array.isArray(skills)) {
        // Disconnect all existing skills
        await prisma.profile.update({
          where: { id: profile.id },
          data: { skills: { set: [] } }
        });

        // Connect or create new skills
        for (const skillName of skills) {
          const skill = await prisma.skill.upsert({
            where: { name: skillName },
            create: { name: skillName },
            update: {}
          });
          
          await prisma.profile.update({
            where: { id: profile.id },
            data: { skills: { connect: { id: skill.id } } }
          });
        }
      }

      // Fetch updated profile
      profile = await prisma.profile.findUnique({
        where: { userId: targetUserId },
        include: { skills: true, portfolio: true }
      }) as any;

      return success(res, profile);
    } catch (e) {
      console.error(e);
      return error(res, 'Failed to update profile');
    }
  },

  // --- PORTFOLIO ---
  async addPortfolioItem(req: AuthRequest, res: Response) {
    try {
      const { title, description, mediaUrl, category, tags } = req.body;
      const userId = req.user!.id;

      let profile = await prisma.profile.findUnique({ where: { userId } });
      if (!profile) {
        profile = await prisma.profile.create({ data: { userId } });
      }

      const item = await prisma.portfolioItem.create({
        data: {
          profileId: profile.id,
          title,
          description,
          mediaUrl,
          category,
          tags: tags ? JSON.stringify(tags) : null
        }
      });

      return success(res, item, 201);
    } catch (e) {
      return error(res, 'Failed to add portfolio item');
    }
  },

  async deletePortfolioItem(req: AuthRequest, res: Response) {
    try {
      const { itemId } = req.params;
      await prisma.portfolioItem.delete({ where: { id: itemId } });
      return success(res, { deleted: true });
    } catch (e) {
      return error(res, 'Failed to delete portfolio item');
    }
  },

  // --- CONNECTIONS ---
  async follow(req: AuthRequest, res: Response) {
    try {
      const { followingId } = req.body;
      const followerId = req.user!.id;

      if (followerId === followingId) {
        return error(res, 'Cannot follow yourself', 400);
      }

      const existing = await prisma.connection.findFirst({
        where: { followerId, followingId }
      });

      if (existing) {
        return success(res, existing);
      }

      const connection = await prisma.connection.create({
        data: { followerId, followingId }
      });

      // Create feed event
      await prisma.feedEvent.create({
        data: {
          actorId: followerId,
          type: 'follow',
          refId: followingId,
          payload: '{}'
        }
      });

      // Notify followed user
      await prisma.notification.create({
        data: {
          userId: followingId,
          type: 'info',
          title: 'New Follower',
          message: 'Someone started following you',
          link: `/profile/${followerId}`
        }
      });

      return success(res, connection, 201);
    } catch (e) {
      return error(res, 'Failed to follow user');
    }
  },

  async unfollow(req: AuthRequest, res: Response) {
    try {
      const { followingId } = req.body;
      const followerId = req.user!.id;

      await prisma.connection.deleteMany({
        where: { followerId, followingId }
      });

      return success(res, { unfollowed: true });
    } catch (e) {
      return error(res, 'Failed to unfollow user');
    }
  },

  async getFollowers(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const connections = await prisma.connection.findMany({
        where: { followingId: userId },
        include: { follower: { select: { id: true, displayName: true, photoURL: true } } }
      });
      return success(res, connections.map(c => c.follower));
    } catch (e) {
      return error(res, 'Failed to fetch followers');
    }
  },

  async getFollowing(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const connections = await prisma.connection.findMany({
        where: { followerId: userId },
        include: { following: { select: { id: true, displayName: true, photoURL: true } } }
      });
      return success(res, connections.map(c => c.following));
    } catch (e) {
      return error(res, 'Failed to fetch following');
    }
  },

  // --- FEED ---
  async getActivityFeed(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { limit = '20' } = req.query;

      // Get users that this user follows
      const following = await prisma.connection.findMany({
        where: { followerId: userId },
        select: { followingId: true }
      });
      const followingIds = following.map(f => f.followingId);
      followingIds.push(userId); // Include own activity

      const events = await prisma.feedEvent.findMany({
        where: { actorId: { in: followingIds } },
        include: { actor: { select: { id: true, displayName: true, photoURL: true } } },
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit as string)
      });

      return success(res, events.map(e => ({
        ...e,
        payload: JSON.parse(e.payload || '{}')
      })));
    } catch (e) {
      return error(res, 'Failed to fetch feed');
    }
  },

  // --- DISCOVERY / SEARCH ---
  async searchProfiles(req: Request, res: Response) {
    try {
      const { query, skill, page = '1', limit = '10' } = req.query;
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);

      const where: any = {};
      
      if (query) {
        where.OR = [
          { user: { displayName: { contains: query as string } } },
          { bio: { contains: query as string } },
          { location: { contains: query as string } }
        ];
      }

      if (skill) {
        where.skills = { some: { name: { contains: skill as string } } };
      }

      const [profiles, total] = await Promise.all([
        prisma.profile.findMany({
          where,
          include: {
            user: { select: { id: true, displayName: true, photoURL: true, role: true } },
            skills: true
          },
          skip: (pageNum - 1) * limitNum,
          take: limitNum
        }),
        prisma.profile.count({ where })
      ]);

      return paginate(res, profiles, total, pageNum, limitNum);
    } catch (e) {
      return error(res, 'Failed to search profiles');
    }
  },

  async getRecommendations(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;

      // Get user's skills
      const profile = await prisma.profile.findUnique({
        where: { userId },
        include: { skills: true }
      });

      const skillNames = profile?.skills.map(s => s.name) || [];

      // Find profiles with similar skills that user doesn't follow
      const following = await prisma.connection.findMany({
        where: { followerId: userId },
        select: { followingId: true }
      });
      const excludeIds = [userId, ...following.map(f => f.followingId)];

      const recommendations = await prisma.profile.findMany({
        where: {
          userId: { notIn: excludeIds },
          skills: skillNames.length > 0 ? { some: { name: { in: skillNames } } } : undefined
        },
        include: {
          user: { select: { id: true, displayName: true, photoURL: true, role: true } },
          skills: true
        },
        take: 10
      });

      return success(res, recommendations);
    } catch (e) {
      return error(res, 'Failed to get recommendations');
    }
  }
};
