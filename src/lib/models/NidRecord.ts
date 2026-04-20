import { Schema, Document, model, models } from "mongoose";

export interface INidRecord extends Document {
  nid: string;
  userId: Schema.Types.ObjectId;
  registeredAt: Date;
}

const NidRecordSchema = new Schema<INidRecord>({
  nid: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  registeredAt: { type: Date, default: Date.now },
});

export const NidRecord = models.NidRecord ?? model<INidRecord>("NidRecord", NidRecordSchema);
