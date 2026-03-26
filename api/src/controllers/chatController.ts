import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { success, error } from '../utils/response';
import { AuthRequest } from '../middleware/auth';
import { getSocket } from '../utils/socket';

export const chatController = {
  async getRooms(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const rooms = await prisma.chatRoom.findMany({
        where: {
          participants: { contains: userId }
        },
        orderBy: { updatedAt: 'desc' }
      });

      const parsedRooms = rooms.map(room => ({
        ...room,
        participants: JSON.parse(room.participants)
      })).filter(room => room.participants.includes(userId));

      return success(res, parsedRooms);
    } catch (e) {
      return error(res, 'Failed to fetch rooms');
    }
  },

  async getMessages(req: AuthRequest, res: Response) {
    try {
      const { roomId } = req.params;
      const userId = req.user!.id;

      // Check access
      const room = await prisma.chatRoom.findUnique({ where: { id: roomId } });
      if (!room || !JSON.parse(room.participants).includes(userId)) {
        return error(res, 'Access denied', 403);
      }

      const messages = await prisma.message.findMany({
        where: { roomId },
        orderBy: { createdAt: 'asc' },
        take: 100
      });

      return success(res, messages);
    } catch (e) {
      return error(res, 'Failed to fetch messages');
    }
  },

  async createRoom(req: AuthRequest, res: Response) {
    try {
      const { participants, type, refId } = req.body;
      const userId = req.user!.id;

      if (!participants.includes(userId)) {
        participants.push(userId);
      }

      const room = await prisma.chatRoom.create({
        data: {
          participants: JSON.stringify(participants),
          type: type || 'direct',
          refId
        }
      });

      return success(res, { ...room, participants: JSON.parse(room.participants) }, 201);
    } catch (e) {
      return error(res, 'Failed to create room');
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
