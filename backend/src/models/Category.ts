// src/models/category.model.ts
import mongoose, { Document, Schema, Types } from "mongoose";

export type CategoryType = "news" | "marketplace" | "podcast";

export interface ICategory extends Document {
  name: string;
  slug: string;
  categoryType: CategoryType;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
  createdBy?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    categoryType: {
      type: String,
      enum: ["news", "marketplace", "podcast"],
      required: true,
    },
    description: { type: String },
    seoTitle: { type: String },
    seoDescription: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

export const Category = mongoose.model<ICategory>("Category", CategorySchema);
