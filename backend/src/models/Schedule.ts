import mongoose, { Schema } from "mongoose";

export interface ISchedule extends Document {
  station: mongoose.Types.ObjectId;
  title: string;
  host?: mongoose.Types.ObjectId; // ref: User
  startTime: Date;
  endTime: Date;
  recurring: boolean;
  daysOfWeek?: number[]; // 0=Sun ... 6=Sat
}

const ScheduleSchema = new Schema(
  {
    station: { type: mongoose.Schema.Types.ObjectId, ref: "Station", required: true },
    title: { type: String, required: true },
    host: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    recurring: { type: Boolean, default: false },
    daysOfWeek: [{ type: Number }], 
  },
  { timestamps: true }
);

export default mongoose.model<ISchedule>("Schedule", ScheduleSchema);
