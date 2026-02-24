import ConversationModel from "../models/conversation.js";
import MessageModel from "../models/message.js";
import { getOrCreateConversation } from "../services/conversation.service.js";

export const initConnection = async (io) => {
  io.on("connection", async (socket) => {
    getConversation(socket);
  });
};

const getConversation = async (socket) => {
  socket.on("join_conversation", async (otherUserID) => {
    const conversation = await getOrCreateConversation(socket.user.id, otherUserID);

    socket.join(conversation._id.toString());

    socket.emit("conversation_joined", conversation._id);
  });

  socket.on("private_message", async ({ conversationId, content }) => {
    const message = await MessageModel.create({
      conversation: conversationId,
      sender: socket.user.id,
      content,
      readBy: [socket.user.id],
    });

    await ConversationModel.findOneAndUpdate(conversationId, { lastMessage: message._id });

    io.to(conversationId).emit("new_message", message);
  });
};
