import { Types } from "mongoose";
import ConversationModel from "../models/conversation.js";

export async function getOrCreateConversation(userA, userB) {
  if (userA === userB) {
    throw new Error("Cannot create conversation with yourself");
  }

  let conversation = await ConversationModel.findOne({
    participants: { $all: [userA, userB] },
    $expr: { $eq: [{ $size: "$participants" }, 2] },
  })
    .populate("lastMessage")
    .populate("participants", "username")
    .sort({ updatedAt: -1 });

  if (!conversation) {
    conversation = await ConversationModel.create({
      participants: [new Types.ObjectId(userA), new Types.ObjectId(userB)],
    })
  }

  return conversation;
}
