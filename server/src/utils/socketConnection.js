import { Server } from "socket.io";

const socketConnection = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  //   io.use((socket, next) => {
  //     if (!token) {
  //       //   code
  //     } else {
  //       next();
  //     }
  //   });

  return io;
};

export default socketConnection;
