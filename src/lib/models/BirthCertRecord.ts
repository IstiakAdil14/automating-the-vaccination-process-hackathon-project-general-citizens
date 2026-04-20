import { Schema, Document, model, models } from "mongoose";

export interface IBirthCertRecord extends Document {
  birthCertNumber: string;
  dateOfBirth: string;
  userId: Schema.Types.ObjectId;
  registeredAt: Date;
}

const BirthCertRecordSchema = new Schema<IBirthCertRecord>({
  birthCertNumber: { type: String, required: true, unique: true },
  dateOfBirth: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  registeredAt: { type: Date, default: Date.now },
});

export const BirthCertRecord = models.BirthCertRecord ?? model<IBirthCertRecord>("BirthCertRecord", BirthCertRecordSchema);
