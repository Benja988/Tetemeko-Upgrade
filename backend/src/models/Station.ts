import mongoose, { Schema, Document } from "mongoose";

interface IStation extends Document {
  name: string;
  streamUrl: string;
  description?: string;
  logo?: string;
  schedule?: { time: string; program: string }[];
  createdAt: Date;
}

const StationSchema = new Schema<IStation>(
  {
    name: { type: String, required: true, unique: true },
    streamUrl: { type: String, required: true },
    description: { type: String },
    logo: { type: String },
    schedule: [
      {
        time: { type: String },
        program: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IStation>("Station", StationSchema);
