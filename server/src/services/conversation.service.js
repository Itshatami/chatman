import ConversationModel from "../models/conversation.js";

export async function getOrCreateConversation(userA, userB) {
  if (userA === userB) {
    throw new Error("Cannot create conversation with yourself");
  }

  let conversation = await ConversationModel.findOne({
    participants: { $all: [userA, userB] },
    $expr: { $eq: [{ $size: "$participants" }, 2] },
  });

  if (!conversation) {
    conversation = await conversation.create({
      participants: [userA, userB],
    });
  }

  return conversation;
}
