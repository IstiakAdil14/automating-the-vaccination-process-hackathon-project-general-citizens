import { Schema, Document, model, models } from "mongoose";

export interface IAppointment extends Document {
  userId: Schema.Types.ObjectId;
  vaccine: string;
  doseNumber: number;
  facility: string;
  facilityAddress: string;
  datetime: Date;
  status: "confirmed" | "pending" | "completed" | "cancelled" | "rescheduled";
  googleMapsLink?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    userId:          { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    vaccine:         { type: String, required: true },
    doseNumber:      { type: Number, required: true, min: 1 },
    facility:        { type: String, required: true },
    facilityAddress: { type: String, default: "" },
    datetime:        { type: Date, required: true },
    status: {
      type: String,
      enum: ["confirmed", "pending", "completed", "cancelled", "rescheduled"],
      default: "pending",
    },
    googleMapsLink: { type: String },
    notes:          { type: String },
  },
  { timestamps: true }
);

AppointmentSchema.index({ userId: 1, datetime: 1 });

export const AppointmentRecord =
  models.AppointmentRecord ?? model<IAppointment>("AppointmentRecord", AppointmentSchema);
