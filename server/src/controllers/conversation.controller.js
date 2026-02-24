import ConversationModel from "../models/conversation.js";

export const getConversation = async (req, res, next) => {
  const conversations = await ConversationModel.find({
    participants: req.user.id,
  })
    .populate("lastMessage")
    .populate("participants", "username")
    .sort({ updatedAt: -1 });
  return res.json(conversations);
};

