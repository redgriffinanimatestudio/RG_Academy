import { Request, Response } from 'express';
import prisma from '../utils/prisma.js';
import { success, error } from '../utils/response.js';
import { AuthRequest } from '../middleware/auth.js';
import { getSocket } from '../utils/socket.js';

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Real-time messaging system
 */

export const chatController = {
  /**
   * @swagger
   * /api/chat/rooms:
   *   get:
   *     summary: Get all chat rooms for user
   *     tags: [Chat]
   *     security:
   *       - bearerAuth: []
   */
  async getRooms(req: AuthRequest, res: Response) {
    try {
      const rooms = await prisma.chatRoom.findMany({
        where: { participants: { contains: req.user!.id } },
        orderBy: { updatedAt: 'desc' }
      });
      return success(res, rooms.map(r => ({ ...r, participants: JSON.parse(r.participants || '[]') })));
    } catch (e) {
      return error(res, 'Database error');
    }
  },

  /**
   * @swagger
   * /api/chat/rooms/{roomId}/messages:
   *   get:
   *     summary: Get messages for a room
   *     tags: [Chat]
   *     security:
   *       - bearerAuth: []
   */
  async getMessages(req: AuthRequest, res: Response) {
    try {
      const messages = await prisma.message.findMany({
        where: { roomId: req.params.roomId },
        orderBy: { createdAt: 'asc' }
      });
      return success(res, messages);
    } catch (e) {
      return error(res, 'Database error');
    }
  },

  async createRoom(req: AuthRequest, res: Response) {
    try {
      const { type, refId, participants } = req.body;
      const room = await prisma.chatRoom.create({
        data: { type, refId, participants: JSON.stringify(participants || [req.user!.id]) }
      });
      return success(res, room, 201);
    } catch (e) {
      return error(res, 'Failed to create room');
    }
  },

  async sendMessage(req: AuthRequest, res: Response) {
    try {
      const { roomId } = req.params;
      const { text } = req.body;
      
      const message = await prisma.message.create({
        data: { roomId, senderId: req.user!.id, text }
      });

      // Update room last message
      await prisma.chatRoom.update({
        where: { id: roomId },
        data: { lastMessage: text, updatedAt: new Date() }
      });

      // Real-time broadcast
      try {
        const io = getSocket();
        io.to(`room_${roomId}`).emit('new_message', message);

        // Also create a persistent notification for the recipient(s)
        const room = await prisma.chatRoom.findUnique({ where: { id: roomId } });
        if (room) {
          const participants = JSON.parse(room.participants || '[]');
          const recipients = participants.filter((p: string) => p !== req.user!.id);
          
          for (const recipientId of recipients) {
            await prisma.notification.create({
              data: {
                userId: recipientId,
                type: 'info',
                title: 'New Message',
                message: text.length > 50 ? text.substring(0, 47) + '...' : text,
                link: `/aca/eng/messages`
              }
            });
            // Emit count update to specific user
            io.to(`user_${recipientId}`).emit('unread_count_update');
          }
        }
      } catch (err) {
        console.warn('[Socket.IO]: Could not broadcast message/notification');
      }

      return success(res, message, 201);
    } catch (e) {
      return error(res, 'Failed to send message');
    }
  }
};
