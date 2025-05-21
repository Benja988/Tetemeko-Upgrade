import mongoose, { Document, Schema, Types } from "mongoose";

export interface IComment extends Document {
  news: Types.ObjectId;           // Reference to the news item being commented on
  author?: Types.ObjectId;        // Reference to Author (optional)
  user?: Types.ObjectId;          // Reference to User (optional)
  content: string;                // Comment text
  createdAt?: Date;
  updatedAt?: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    news: { type: Schema.Types.ObjectId, ref: "News", required: true },
    author: { type: Schema.Types.ObjectId, ref: "Author" },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export const Comment = mongoose.model<IComment>("Comment", CommentSchema);
