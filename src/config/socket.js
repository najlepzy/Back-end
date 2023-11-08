import { Server } from "socket.io";
import http from "http";

export const socketIo = (app) => {
  const httpServer = http.createServer(app);
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("Socket client connected");
  });

  return httpServer;
};