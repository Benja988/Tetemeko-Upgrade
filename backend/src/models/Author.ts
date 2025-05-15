import mongoose, { Document, Schema } from "mongoose";

/** ================================
 *          AUTHOR SCHEMA
================================= */
export interface IAuthor extends Document {
  name: string;
  email: string;
  password: string;
  bio?: string;
  avatar?: string;
  role: "author";
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const AuthorSchema = new Schema<IAuthor>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String },
    avatar: { type: String },
    role: { type: String, enum: ["author"], default: "author" },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Author = mongoose.model<IAuthor>("Author", AuthorSchema);
