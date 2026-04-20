import { Schema, Document, model, models } from "mongoose";

export interface IFamilyMember {
  userId: Schema.Types.ObjectId;
  relation: string;
  addedAt: Date;
}

export interface IFamilyGroup extends Document {
  ownerId: Schema.Types.ObjectId;
  members: IFamilyMember[];
  createdAt: Date;
}

const FamilyGroupSchema = new Schema<IFamilyGroup>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    members: [
      {
        userId:   { type: Schema.Types.ObjectId, ref: "User", required: true },
        relation: { type: String, required: true },
        addedAt:  { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const FamilyGroup =
  models.FamilyGroup ?? model<IFamilyGroup>("FamilyGroup", FamilyGroupSchema);
