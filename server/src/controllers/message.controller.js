import { Types } from "mongoose";
import MessageModel from "../models/message.js";

export const getMessages = async (req, res, next) => {
  try {    
    const { conversationId } = req.params;
    // console.log("messages, conversationId -> ", conversationId);

    const messages = await MessageModel.find({
      conversation: new Types.ObjectId(conversationId),
    })
      .sort({ createdAt: -1 })
      .limit(50);
    
      console.log(messages);
      
    
    if (!messages) return res.json({ message: "no messages yet", messages: [] });
    return res.json(messages.reverse());
  } catch (error) {
    next(error);
  }
};
