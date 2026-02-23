export const initConnection = async (io) => {
  io.on("connection", async (socket) => {
    console.log("user -> ", socket.id);
  });
};
