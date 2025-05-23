import mongoose, { Document, Schema } from "mongoose";

export interface IStation extends Document {
  name: string;
  description?: string;
  streamUrl: string;
  logoUrl?: string;
  location?: string;
  genres: string[];
  isActive: boolean;
  owner: mongoose.Types.ObjectId; // ref: User
}

const StationSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    streamUrl: { type: String, required: true },
    logoUrl: { type: String },
    location: { type: String },
    genres: [{ type: String }],
    isActive: { type: Boolean, default: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IStation>("Station", StationSchema);
