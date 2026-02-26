import { Server } from "socket.io";
import jwt from "jsonwebtoken";

const socketConnection = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
      socket.user = decode.user;
      next();
    } catch (error) {
      next(new Error("unauthorized"));
    }
  });

  return io;
};

export default socketConnection;
