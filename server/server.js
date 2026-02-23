import http from "http";
import app from "./app.js";
import { config } from "dotenv";
import mongoose from "mongoose";
import socketHandler from "./src/socket/index.js";
import socketConnection from "./src/utils/socketConnection.js";

config();
// DB connection
const connetToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to DB -> ", mongoose.connection.host);
  } catch (error) {
    console.log("error DB -> ", error.message);
  }
};

const startServer = () => {
  const PORT = process.env.PORT;
  const httpServer = http.createServer(app);
  const io = socketConnection(httpServer);
  socketHandler(io);
  httpServer.listen(PORT, () => console.log("live on -> ", PORT));
};

const run = async () => {
  await connetToDB();
  startServer();
};

run();
