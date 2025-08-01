import mongoose from "mongoose";

import { v4 as uuid } from "uuid";

const userSchema = new mongoose.Schema(
  {
    //Users who has login ability should go under User schema
    _id: {
      type: String,
      required: true,
      default: () => uuid(),
    },
    name: {
      type: String,
      required: false,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: false,
      lowercase: true,
    },
    password: {
      type: String,
    },
    providers: {
      type: String,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    isOTPVerified: {
      type: Boolean,
      default: false,
    },
    role: { type: String, ref: "Role" },
    provider: [{ type: String, ref: "Provider" }],
    deviceType: { type: String },
    deviceTokens: {
      type: [String],
      default: [],
    },
    deviceId: { type: String },
    isSystemGeneratedPassword: {
      type: Boolean,
      default: false,
    },
    profilePic: {
      type: String,
    },
  },
  {
    strict: true,
    timestamps: true,
  }
);
userSchema.index({ mobile: 1, email: 1 }, { unique: true });

const User = mongoose.model("User", userSchema);
export default User;
