/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import mongoose, { Schema, Document } from "mongoose";

export interface MessageDocument extends Document {
  id: string;
  villageId: string;
  citizenUsername?: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: "unread" | "read" | "resolved";
  adminRemarks?: string;
  date: string;
}

const MessageSchema = new Schema<MessageDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    villageId: { type: String, required: true, default: "vendra", index: true },
    citizenUsername: { type: String, default: "", index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, default: "", trim: true },
    phone: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["unread", "read", "resolved"],
      default: "unread",
    },
    adminRemarks: { type: String, default: "" },
    date: {
      type: String,
      default: () => new Date().toISOString().split("T")[0],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Message =
  mongoose.models.Message || mongoose.model<MessageDocument>("Message", MessageSchema);

