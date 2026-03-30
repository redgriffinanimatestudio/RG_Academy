import { Server as SocketIOServer, Socket } from "socket.io";

let io: SocketIOServer;

export const initSocket = (socketServer: SocketIOServer) => {
  io = socketServer;

  io.on('connection', (socket: Socket) => {
    const userId = socket.handshake.query.userId as string;
    
    if (userId) {
      socket.join(`user:${userId}`);
      console.log(`[Socket] User ${userId} connected and joined room.`);
    }

    socket.on('disconnect', () => {
      console.log(`[Socket] User ${userId} disconnected.`);
    });
  });
};

export const getSocket = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
};

/**
 * Sends a real-time notification to a specific user
 */
export const notifyUser = (userId: string, event: string, data: any) => {
  if (!io) return;
  io.to(`user:${userId}`).emit(event, data);
};

export default { initSocket, getSocket, notifyUser };