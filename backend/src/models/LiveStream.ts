import mongoose, { Schema, Document } from "mongoose";

interface IChatMessage extends Document {
  stationId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  username: string;
  message: string;
  timestamp: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>({
  stationId: { type: Schema.Types.ObjectId, ref: "Station", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  username: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const ChatMessage = mongoose.model<IChatMessage>("ChatMessage", ChatMessageSchema);

export default ChatMessage;
