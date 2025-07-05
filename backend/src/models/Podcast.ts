import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPodcast extends Document {
  title: string;
  description: string;
  coverImage?: string;
  category: Types.ObjectId;
  station?: Types.ObjectId;
  createdBy: Types.ObjectId;
  isActive: boolean;
  episodes: Types.ObjectId[];
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PodcastSchema: Schema<IPodcast> = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: [200, "Title cannot exceed 200 characters"] },
    description: { type: String, required: true, trim: true },
    coverImage: {
      type: String,
      validate: {
        validator: (url: string) => !url || /^https:\/\/res\.cloudinary\.com\//.test(url),
        message: "coverImage must be a valid Cloudinary URL",
      },
    },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true, index: true },
    station: { type: Schema.Types.ObjectId, ref: "Station", index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    isActive: { type: Boolean, default: true },
    episodes: [{ type: Schema.Types.ObjectId, ref: "Episode" }],
    tags: [{ type: String, trim: true }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Ensure indexes for faster queries
PodcastSchema.index({ category: 1, createdBy: 1 });

export default mongoose.model<IPodcast>("Podcast", PodcastSchema);