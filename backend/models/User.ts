/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import mongoose, { Schema, Document } from "mongoose";

export interface UserDocument extends Document {
  username: string;
  passwordHash: string;
  role: "admin" | "citizen";
  fullName: string;
  phone: string;
  email: string;
  villageId: string;
  ward: string;
  savedCertificates: string[];
  savedSchemes: string[];
}

const UserSchema = new Schema<UserDocument>(
  {
    username: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "citizen"], default: "citizen", index: true },
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, default: "", trim: true },
    email: { type: String, default: "", trim: true },
    villageId: { type: String, default: "vendra", index: true },
    ward: { type: String, default: "" },
    savedCertificates: { type: [String], default: [] },
    savedSchemes: { type: [String], default: [] },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const User = mongoose.models.User || mongoose.model<UserDocument>("User", UserSchema);

