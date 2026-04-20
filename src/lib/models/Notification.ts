import { Schema, Document, model, models } from "mongoose";

export type NotificationType =
  | "dose_reminder"
  | "appointment_confirmed"
  | "appointment_reminder"
  | "push_subscription"
  | "system";

export interface INotification extends Document {
  userId: Schema.Types.ObjectId;
  type: NotificationType;
  message: string;
  read: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId:  { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: {
      type: String,
      enum: ["dose_reminder", "appointment_confirmed", "appointment_reminder", "push_subscription", "system"],
      required: true,
    },
    message: { type: String, required: true },
    read:    { type: Boolean, default: false },
  },
  { timestamps: true }
);

NotificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

export const Notification =
  models.Notification ?? model<INotification>("Notification", NotificationSchema);
