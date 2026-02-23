import { Schema, Types, model } from "mongoose";

const ConversationSchema = new Schema(
  {
    participants: [{ type: Types.ObjectId, ref: "User", required: true }],
    lastMessage: { type: Types.ObjectId, ref: "Message" },
  },
  { timestamps: true }
);

ConversationSchema.index({ participants: 1, unique: false });


const ConversationModel = model("Conversation", ConversationSchema);

export default ConversationModel;

