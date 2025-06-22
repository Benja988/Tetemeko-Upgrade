import mongoose, { Document, Schema } from "mongoose";

export interface IStation extends Document {
  name: string;
  description?: string;
  streamUrl?: string;
  imageUrl: string;
  location: string;
  genre: string[];
  isActive: boolean;
  type: "Radio Station" | "TV Station";
  liveShow?: string;
  listenerz?: number;
}

const StationSchema: Schema<IStation> = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    streamUrl: { type: String }, // optional
    imageUrl: { type: String, required: false }, // renamed from logoUrl
    location: { type: String, required: true },
    genre: [{ type: String }], // aligned with frontend
    isActive: { type: Boolean, default: true },
    type: {
      type: String,
      enum: ["Radio Station", "TV Station"],
      required: true,
    },
    liveShow: { type: String },
    listenerz: { type: Number },
  },
  { timestamps: true }
);

const Station = mongoose.model<IStation>("Station", StationSchema);
export default Station;
