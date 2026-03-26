import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { success, error } from '../utils/response';
import { AuthRequest } from '../middleware/auth';
import { getSocket } from '../utils/socket';

/**
 * @swagger
 * components:
 *   schemas:
 *     ChatRoom:
 *       type: object
 *       properties:
 *         id: { type: string }
 *         participants: { type: array, items: { type: string } }
 *         type: { type: string }
 *         lastMessage: { type: string }
 *     Message:
 *       type: object
 *       properties:
 *         id: { type: string }
 *         roomId: { type: string }
 *         senderId: { type: string }
 *         text: { type: string }
 *         createdAt: { type: string, format: date-time }
 */

export const chatController = {
  /**
   * @swagger
   * /api/chat/rooms:
   *   get:
   *     summary: Get user's chat rooms
   *     tags: [Chat]
   *     responses:
   *       200:
   *         description: List of chat rooms
   */
  async getRooms(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const rooms = await prisma.chatRoom.findMany({
        orderBy: { updatedAt: 'desc' }
      });

      const userRooms = rooms.filter(room => {
        try {
          const participants = JSON.parse(room.participants || '[]');
          return Array.isArray(participants) && participants.includes(userId);
        } catch(e) { return false; }
      }).map(room => ({
        ...room,
        participants: JSON.parse(room.participants)
      }));

      return success(res, userRooms);
    } catch (e) {
      return error(res, 'Database error while fetching rooms');
    }
  },

  /**
   * @swagger
   * /api/chat/rooms:
   *   post:
   *     summary: Create a chat room
   *     tags: [Chat]
   *     responses:
   *       201:
   *         description: Room created
   */
  async createRoom(req: AuthRequest, res: Response) {
    try {
      const { participants, type, refId } = req.body;
      const userId = req.user!.id;

      let roomParticipants = Array.isArray(participants) ? participants : [];
      if (!roomParticipants.includes(userId)) {
        roomParticipants.push(userId);
      }

      const room = await prisma.chatRoom.create({
        data: {
          participants: JSON.stringify(roomParticipants),
          type: type || 'direct',
          refId
        }
      });

      return success(res, { ...room, participants: roomParticipants }, 201);
    } catch (e) {
      return error(res, 'Failed to create room');
    }
  },

  async getMessages(req: AuthRequest, res: Response) {
    try {
      const { roomId } = req.params;
      const senderId = req.user!.id;

      // Check access
      const room = await prisma.chatRoom.findUnique({ where: { id: roomId } });
      if (!room || !JSON.parse(room.participants).includes(senderId)) {
        return error(res, 'Access denied', 403);
      }

      const messages = await prisma.message.findMany({
        where: { roomId },
        orderBy: { createdAt: 'asc' }
      });

      return success(res, messages);
    } catch (e) {
      return error(res, 'Failed to fetch messages');
    }
  },

  async sendMessage(req: AuthRequest, res: Response) {
    try {
      const { roomId } = req.params;
      const { text } = req.body;
      const senderId = req.user!.id;

      // Check access
      const room = await prisma.chatRoom.findUnique({ where: { id: roomId } });
      if (!room || !JSON.parse(room.participants).includes(senderId)) {
        return error(res, 'Access denied', 403);
      }

      const message = await prisma.message.create({
        data: {
          roomId,
          senderId,
          text
        }
      });

      await prisma.chatRoom.update({
        where: { id: roomId },
        data: {
          lastMessage: text,
          updatedAt: new Date()
        }
      });

      // Emit via Socket.IO
      try {
        const io = getSocket();
        io.to(`room-${roomId}`).emit('new-message', message);
      } catch (err) {
        console.warn('Socket emit failed:', err.message);
      }

      return success(res, message, 201);
    } catch (e) {
      return error(res, 'Failed to send message');
    }
  }
};
