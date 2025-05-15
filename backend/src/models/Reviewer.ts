import mongoose, { Document, Schema } from "mongoose";

/** ================================
 *         REVIEWER SCHEMA
================================= */
export interface IReviewer extends Document {
  name: string;
  email: string;
  password: string;
  department?: string;
  avatar?: string;
  role: "reviewer";
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const ReviewerSchema = new Schema<IReviewer>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    department: { type: String },
    avatar: { type: String },
    role: { type: String, enum: ["reviewer"], default: "reviewer" },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Reviewer = mongoose.model<IReviewer>("Reviewer", ReviewerSchema);
