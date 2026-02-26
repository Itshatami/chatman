import ConversationModel from "../models/conversation.js";
import MessageModel from "../models/message.js";

export const initConnection = async (io) => {
  io.on("connection", async (socket) => {
    // console.log("user connected->", socket.id);
    // console.log("user obj inside socket.auth ->" , socket.user.id);

    socket.on("join_conversation", (conversationId) => {
      socket.join(conversationId);
      console.log(`* user: ${socket.user} joinded conversation: ${conversationId}`);
    });

    socket.on("leave_conversation", (conversationId) => {
      socket.leave(conversationId);
      console.log(`# user: ${socket.user} leave conversation: ${conversationId}`);
    });

    socket.on("send_message", async ({ conversationId, content }) => {
      const message = await MessageModel.create({
        conversation: conversationId,
        sender: socket.user.id,
        content,
        readBy: [socket.user.id],
      });

      await ConversationModel.findByIdAndUpdate(conversationId, { lastMessage: message._id });

      io.to(conversationId).emit("new_message , message");
    });
  });
};
