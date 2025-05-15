import mongoose, { Document, Schema } from "mongoose";
import { IAuthor } from "./Author";
import { IReviewer } from "./Reviewer";

/** ================================
 *       COMMENT SCHEMA
================================= */
export interface IComment {
  name: string;
  email: string;
  comment: string;
  replies: IComment[];
  createdAt?: Date;
  updatedAt?: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    comment: { type: String, required: true },
    replies: [this],
  },
  { timestamps: true }
);

/** ================================
 *          NEWS SCHEMA
================================= */
export interface INews extends Document {
  title: string;
  text: string;
  category: string;
  thumbnail: string;
  author: mongoose.Schema.Types.ObjectId | IAuthor;
  reviewer: mongoose.Schema.Types.ObjectId | IReviewer;
  status: "pending" | "approved" | "rejected";
  isDeleted: boolean;
  readTime?: number;
  views: number;
  comments: IComment[];
  createdAt?: Date;
  updatedAt?: Date;
}

const NewsSchema = new Schema<INews>(
  {
    title: { type: String, required: true },
    text: { type: String, required: true },
    category: { type: String, required: true },
    thumbnail: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "Author", required: true },
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "Reviewer" },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    isDeleted: { type: Boolean, default: false },
    readTime: { type: Number },
    views: { type: Number, default: 0 },
    comments: [CommentSchema],
  },
  { timestamps: true }
);

/** ================================
 *          MIDDLEWARE
================================= */

// Set read time before saving
NewsSchema.pre("save", function (next) {
  const wordsPerMinute = 200;
  const words = this.text?.split(/\s+/).length || 0;
  this.readTime = Math.ceil(words / wordsPerMinute);
  next();
});

// Filter out deleted documents from queries
NewsSchema.pre(/^find/, function (this: mongoose.Query<any, any>, next) {
  this.find({ isDeleted: false });
  next();
});

/** ================================
 *          EXPORT MODEL
================================= */
export const News = mongoose.model<INews>("News", NewsSchema);
