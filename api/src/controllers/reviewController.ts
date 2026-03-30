import { Request, Response } from 'express';
import prisma from '../utils/prisma.js';
import { success, error } from '../utils/response.js';
import { AuthRequest } from '../middleware/auth.js';

export const reviewController = {
  // 1. Create or Find Review Session
  async getOrCreateSession(req: AuthRequest, res: Response) {
    try {
      const { projectId, taskId, mediaUrl, mediaType } = req.body;
      
      // Try to find existing active session
      let session = await prisma.reviewSession.findFirst({
        where: { 
          projectId, 
          taskId: taskId || null,
          mediaUrl,
          status: 'active'
        },
        include: { annotations: { include: { author: { select: { displayName: true, photoURL: true } } }, orderBy: { createdAt: 'asc' } } }
      });

      if (!session) {
        session = await prisma.reviewSession.create({
          data: { projectId, taskId, mediaUrl, mediaType, status: 'active' },
          include: { annotations: true }
        }) as any;
      }

      return success(res, session);
    } catch (e: any) {
      return error(res, 'Failed to initialize review session');
    }
  },

  // 2. Add Annotation
  async addAnnotation(req: AuthRequest, res: Response) {
    try {
      const { sessionId, type, data, timestamp } = req.body;
      const authorId = req.user!.id;

      const annotation = await prisma.annotation.create({
        data: {
          sessionId,
          authorId,
          type,
          data: JSON.stringify(data), // { x, y, text, etc }
          timestamp: timestamp || null
        },
        include: { author: { select: { displayName: true, photoURL: true } } }
      });

      return success(res, annotation, 201);
    } catch (e: any) {
      return error(res, 'Failed to add annotation');
    }
  },

  // 3. Get Annotations for Session
  async getAnnotations(req: Request, res: Response) {
    try {
      const { sessionId } = req.params;
      const annotations = await prisma.annotation.findMany({
        where: { sessionId },
        include: { author: { select: { displayName: true, photoURL: true } } },
        orderBy: { createdAt: 'asc' }
      });
      return success(res, annotations);
    } catch (e: any) {
      return error(res, 'Failed to fetch annotations');
    }
  },

  // 4. Resolve/Close Session
  async closeSession(req: AuthRequest, res: Response) {
    try {
      const { sessionId } = req.params;
      const session = await prisma.reviewSession.update({
        where: { id: sessionId },
        data: { status: 'closed' }
      });
      return success(res, session);
    } catch (e: any) {
      return error(res, 'Failed to close session');
    }
  }
};
