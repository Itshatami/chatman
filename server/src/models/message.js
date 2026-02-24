import { Schema, Types, model } from "mongoose";

const MessageSchema = new Schema(
  {
    conversation: { type: Types.ObjectId, ref: "Conversation", required: true },
    sender: { type: Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    readBy: [{ type: Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

MessageSchema.index({ conversation: 1, createdAt: -1 });

const MessageModel = model("Message", MessageSchema);

export default MessageModel;
