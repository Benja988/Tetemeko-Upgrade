import mongoose, { Document, Schema, Types } from "mongoose";

export interface INews extends Document {
  title: string;
  content: string;
  summary?: string;
  author: Types.ObjectId;         // Reference to Author model
  category?: Types.ObjectId;      // Reference to Category model
  tags?: string[];
  publishedAt?: Date;
  isPublished: boolean;
  thumbnail?: string;             // URL of thumbnail image
  featuredImage?: string;         // URL of featured image/banner
  seoTitle?: string;              // SEO optimized title
  seoDescription?: string;        // SEO meta description
  readingTime?: number;           // Estimated reading time in minutes
  viewsCount: number;             // Number of views
  isFeatured: boolean;            // Mark news as featured
  isBreaking: boolean;            // Mark news as breaking news
  comments: Types.ObjectId[];     // References to Comment documents
  createdAt?: Date;
  updatedAt?: Date;
}

const NewsSchema = new Schema<INews>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    summary: { type: String },
    author: { type: Schema.Types.ObjectId, ref: "Author", required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category" }, 
    tags: [{ type: String }],
    publishedAt: { type: Date },
    isPublished: { type: Boolean, default: false },
    thumbnail: { type: String },
    featuredImage: { type: String },
    seoTitle: { type: String },
    seoDescription: { type: String },
    readingTime: { type: Number },
    viewsCount: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isBreaking: { type: Boolean, default: false },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

export const News = mongoose.model<INews>("News", NewsSchema);
