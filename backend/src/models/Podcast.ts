import mongoose, { Schema } from "mongoose";

export interface IPodcast extends Document {
  title: string;
  description: string;
  coverImage?: string;
  categories: string[];
  isActive: boolean;
  createdBy: mongoose.Types.ObjectId; // ref: User
  station?: mongoose.Types.ObjectId;  // optional: if podcast is from a station
}

const PodcastSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    coverImage: { type: String },
    categories: [{ type: String }],
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    station: { type: mongoose.Schema.Types.ObjectId, ref: "Station" },
  },
  { timestamps: true }
);

export default mongoose.model<IPodcast>("Podcast", PodcastSchema);
