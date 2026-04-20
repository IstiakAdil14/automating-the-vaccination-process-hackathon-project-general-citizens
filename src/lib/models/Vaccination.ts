import { Schema, Document, model, models } from "mongoose";

export interface IVaccination extends Document {
  userId: Schema.Types.ObjectId;
  vaccine: string;
  doseNumber: number;
  dueDate: Date;
  completedDate?: Date;
  facility?: string;
  status: "scheduled" | "due_soon" | "overdue" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

const VaccinationSchema = new Schema<IVaccination>(
  {
    userId:        { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    vaccine:       { type: String, required: true },
    doseNumber:    { type: Number, required: true, min: 1 },
    dueDate:       { type: Date, required: true },
    completedDate: { type: Date },
    facility:      { type: String },
    status: {
      type: String,
      enum: ["scheduled", "due_soon", "overdue", "completed"],
      default: "scheduled",
    },
  },
  { timestamps: true }
);

VaccinationSchema.index({ userId: 1, status: 1 });

export const Vaccination = models.Vaccination ?? model<IVaccination>("Vaccination", VaccinationSchema);
