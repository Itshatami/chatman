import { initConnection } from "./chat.socket.js";

const socketHandler = (io) => {
  initConnection(io);
};

export default socketHandler;
