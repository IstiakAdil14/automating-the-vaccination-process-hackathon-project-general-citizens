import { Schema, Document, model, models } from "mongoose";

export interface IUser extends Document {
  identityType: "nid" | "birth_cert";
  nid?: string;
  birthCertNumber?: string;
  birthCertDob?: string;
  fullName: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other" | "";
  division: string;
  district: string;
  subDistrict: string;
  village: string;
  pendingEmail?: string;
  email?: string;
  passwordHash: string;
  otp?: string;
  otpExpiry?: Date;
  otpType?: "register" | "forgot_password";
  isVerified: boolean;
  failedLoginAttempts: number;
  lockedUntil?: Date;
  language: "en" | "bn";
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    identityType: { type: String, enum: ["nid", "birth_cert"], required: true },
    nid: { type: String, sparse: true, unique: true },
    birthCertNumber: { type: String, sparse: true, unique: true },
    birthCertDob: String,
    fullName: { type: String, default: "" },
    dateOfBirth: { type: String, default: "" },
    gender: { type: String, enum: ["male", "female", "other", ""], default: "" },
    division: { type: String, default: "" },
    district: { type: String, default: "" },
    subDistrict: { type: String, default: "" },
    village: { type: String, default: "" },
    pendingEmail: { type: String, sparse: true },
    email: { type: String, required: false, default: undefined, sparse: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    otp: String,
    otpExpiry: Date,
    otpType: { type: String, enum: ["register", "forgot_password"] },
    isVerified: { type: Boolean, default: false },
    failedLoginAttempts: { type: Number, default: 0 },
    lockedUntil: Date,
    language: { type: String, enum: ["en", "bn"], default: "en" },
  },
  { timestamps: true }
);

export const User = models.User ?? model<IUser>("User", UserSchema);
