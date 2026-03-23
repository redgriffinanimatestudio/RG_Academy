import { Server as SocketIOServer } from "socket.io";

let io: SocketIOServer;

export const initSocket = (socketServer: SocketIOServer) => {
  io = socketServer;
};

export const getSocket = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
};

export default { initSocket, getSocket };