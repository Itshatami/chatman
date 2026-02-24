import { Types } from "mongoose";
import ConversationModel from "../models/conversation.js";
import { getOrCreateConversation } from "../services/conversation.service.js";

// Get all user conversations
export async function getAllUserConversations(req, res, next) {
  try {
    const userId = new Types.ObjectId(req.user.id);
    
    const conversations = await ConversationModel.find({   participants: { $in: [userId] },}).lean();
    console.log(conversations);

    if (!conversations) return res.status(404).json({ message: "no conversations found" });
    return res.json({ conversations });
  } catch (error) {
    next(error);
  }
}

export async function findOrCreateConversation(req, res, next) {
  try {
    const user = req.user;
    console.log("user-> ", user);

    const { otherUserId } = req.body;
    console.log("otherUserId-> ", otherUserId);

    const conversation = await getOrCreateConversation(user.id, otherUserId);
    return res.json(conversation);
  } catch (error) {
    next(error);
  }
}

export async function findConversationById(req, res, next) {
  try {
    const { conversationId } = req.params;
    const conversation = await ConversationModel.findOne({ _id: conversationId });
    if (!conversation) throw new Error("conversation not found");
    return res.json(conversation);
  } catch (error) {
    next(error);
  }
}

// Find user conversation
// export async function findUserConversation(req, res, next) {
//   try {
//     const user = req.user;
//     const conversationId = req.params.conversationId;
//     const conversation = await ConversationModel.findOne({ _id: conversationId }).lean();
//     if (!conversation) return res.status(404).json({ message: "no conversation found" });
//     return res.json({ conversation });
//   } catch (error) {
//     next(error);
//   }
// }

// // Create conversation
// export async function createConversation(req, res, next) {
//   const otherUserId = req.body.otherUserId;

// }
