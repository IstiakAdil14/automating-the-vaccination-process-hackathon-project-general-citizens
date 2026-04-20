import { Schema, Document, model, models } from "mongoose";

export interface IPushSubscription extends Document {
  userId: Schema.Types.ObjectId;
  endpoint: string;
  keys: { p256dh: string; auth: string };
  preferences: {
    doseReminders: boolean;
    appointmentReminders: boolean;
    systemAlerts: boolean;
  };
  createdAt: Date;
}

const PushSubscriptionSchema = new Schema<IPushSubscription>(
  {
    userId:   { type: Schema.Types.ObjectId, ref: "User", required: true },
    endpoint: { type: String, required: true, unique: true },
    keys: {
      p256dh: { type: String, required: true },
      auth:   { type: String, required: true },
    },
    preferences: {
      doseReminders:        { type: Boolean, default: true },
      appointmentReminders: { type: Boolean, default: true },
      systemAlerts:         { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

PushSubscriptionSchema.index({ userId: 1 });

export const PushSubscriptionModel =
  models.PushSubscription ?? model<IPushSubscription>("PushSubscription", PushSubscriptionSchema);
