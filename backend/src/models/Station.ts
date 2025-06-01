import mongoose, { Document, Schema, Types } from "mongoose";

export interface IStation extends Document {
  name: string;
  description?: string;
  streamUrl: string;
  logoUrl?: string;
  location?: string;
  genres: string[];
  isActive: boolean;
}

const StationSchema: Schema<IStation> = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    streamUrl: { type: String, required: true },
    logoUrl: { type: String },
    location: { type: String },
    genres: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Station = mongoose.model<IStation>("Station", StationSchema);
export default Station;
