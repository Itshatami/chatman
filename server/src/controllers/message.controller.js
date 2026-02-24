import MessageModel from "../models/message.js";

export const getMessages = async (req, res, next) => {
  const conversationId = req.params.conversationId;
  const messages = await MessageModel.find({
    conversation: conversationId,
  })
    .sort({ createdAt: -1 })
    .limit(50);

  return res.json(messages.reverse());
};
