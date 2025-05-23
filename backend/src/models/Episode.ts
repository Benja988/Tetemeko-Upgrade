import mongoose, { Schema } from "mongoose";

export interface IEpisode extends Document {
  podcast: mongoose.Types.ObjectId; // ref: Podcast
  title: string;
  audioUrl: string;
  description?: string;
  duration: number; // in seconds
  publishedAt: Date;
}

const EpisodeSchema: Schema = new Schema(
  {
    podcast: { type: mongoose.Schema.Types.ObjectId, ref: "Podcast", required: true },
    title: { type: String, required: true },
    audioUrl: { type: String, required: true },
    description: { type: String },
    duration: { type: Number, required: true },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IEpisode>("Episode", EpisodeSchema);
