import mongoose, { Document, Schema } from "mongoose";

/** ================================
 *          AUTHOR SCHEMA
================================= */
export interface IAuthor extends Document {
  name: string;
  email?: string;           // Optional, if you want to contact author
  bio?: string;
  avatar?: string;          // URL to profile image
  role: "author";
  isVerified: boolean;      // For content approval or trust
  createdAt?: Date;
  updatedAt?: Date;
}

const AuthorSchema = new Schema<IAuthor>(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },  // optional but unique if present
    bio: { type: String },
    avatar: { type: String },
    role: { type: String, enum: ["author"], default: "author" },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Author = mongoose.model<IAuthor>("Author", AuthorSchema);
