/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import mongoose, { Schema, Document } from "mongoose";
import { DatabaseSchema } from "../types";

export interface VillageDocument extends Omit<DatabaseSchema, "id">, Document {
  id: string;
}

const OfficialSchema = new Schema(
  {
    designation: { type: String, required: true },
    name: { type: String, required: true },
    nameTe: { type: String, default: "" },
    category: { type: String },
    contact: { type: String, default: "" },
  },
  { _id: false }
);

const WardMemberSchema = new Schema(
  {
    ward: { type: Schema.Types.Mixed, required: true },
    name: { type: String, required: true },
    nameTe: { type: String, default: "" },
    category: { type: String },
    contact: { type: String, default: "" },
  },
  { _id: false }
);

const StaffMemberSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    designation: { type: String, required: true },
    contact: { type: String, required: true },
    department: {
      type: String,
      enum: ["Panchayat", "Sachivalayam", "Anganwadi", "Health", "VOA"],
      default: "Sachivalayam",
    },
  },
  { _id: false }
);

const AnnouncementSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: String, required: true },
    category: {
      type: String,
      enum: ["General", "Welfare", "Meeting", "Alert"],
      default: "General",
    },
  },
  { _id: false }
);

const GalleryItemSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ["Infrastructure", "Events", "Schools", "Agriculture", "Admin"],
      default: "Infrastructure",
    },
    imageUrl: { type: String, required: true },
  },
  { _id: false }
);

const VillageSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    nameTe: { type: String, default: "" },
    mandal: { type: String, default: "" },
    mandalTe: { type: String, default: "" },
    district: { type: String, default: "" },
    districtTe: { type: String, default: "" },
    type: { type: String },
    grade: { type: String },
    stats: { type: Schema.Types.Mixed, default: {} },
    about: { type: Schema.Types.Mixed, default: {} },
    officials: { type: [OfficialSchema], default: [] },
    wardMembers: { type: [WardMemberSchema], default: [] },
    voters: { type: Schema.Types.Mixed, default: {} },
    staff: { type: [StaffMemberSchema], default: [] },
    land: { type: Schema.Types.Mixed, default: {} },
    education: { type: Schema.Types.Mixed, default: {} },
    health: { type: Schema.Types.Mixed, default: {} },
    water: { type: Schema.Types.Mixed, default: {} },
    ration: { type: Schema.Types.Mixed, default: {} },
    shg: { type: Schema.Types.Mixed, default: {} },
    pensions: { type: Schema.Types.Mixed, default: {} },
    infrastructure: { type: Schema.Types.Mixed, default: {} },
    location: { type: Schema.Types.Mixed },
    demographics: { type: Schema.Types.Mixed },
    hospitals: { type: Schema.Types.Mixed },
    socialCategories: { type: Schema.Types.Mixed },
    educationDetailed: { type: Schema.Types.Mixed },
    markets: { type: Schema.Types.Mixed },
    burialGrounds: { type: Schema.Types.Mixed },
    parks: { type: Schema.Types.Mixed },
    waterBodies: { type: Schema.Types.Mixed },
    streetLights: { type: Schema.Types.Mixed },
    trade: { type: Schema.Types.Mixed },
    planning: { type: Schema.Types.Mixed },
    sanitation: { type: Schema.Types.Mixed },
    revenue: { type: Schema.Types.Mixed },
    roads: { type: Schema.Types.Mixed },
    facilities: { type: Schema.Types.Mixed },
    communication: { type: Schema.Types.Mixed },
    climate: { type: Schema.Types.Mixed },
    literacy: { type: Schema.Types.Mixed },
    slums: { type: Schema.Types.Mixed },
    announcements: { type: [AnnouncementSchema], default: [] },
    gallery: { type: [GalleryItemSchema], default: [] },
  },
  {
    timestamps: true,
    strict: false,
    versionKey: false,
  }
);

export const Village =
  mongoose.models.Village || mongoose.model<VillageDocument>("Village", VillageSchema);

