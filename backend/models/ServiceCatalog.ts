/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import mongoose, { Schema, Document } from "mongoose";

export interface CertificateDocument extends Document {
  id: string;
  villageId: string;
  name: string;
  nameTe: string;
  description: string;
  descriptionTe: string;
  category: "identity" | "welfare" | "records" | "revenue";
  documents: string[];
  steps: string[];
  processingTime: string;
  fee: string;
  officeLocation: string;
  downloadUrl: string | null;
}

export interface SchemeDocument extends Document {
  id: string;
  villageId: string;
  name: string;
  nameTe: string;
  category: string;
  benefits: string;
  benefitsTe: string;
  eligibility: string;
  eligibilityTe: string;
  documents: string[];
  steps: string[];
  officialUrl: string | null;
}

const CertificateSchema = new Schema<CertificateDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    villageId: { type: String, default: "all", index: true },
    name: { type: String, required: true, trim: true },
    nameTe: { type: String, default: "", trim: true },
    description: { type: String, required: true, trim: true },
    descriptionTe: { type: String, default: "", trim: true },
    category: {
      type: String,
      enum: ["identity", "welfare", "records", "revenue"],
      default: "identity",
    },
    documents: { type: [String], default: [] },
    steps: { type: [String], default: [] },
    processingTime: { type: String, default: "7 - 15 Working Days" },
    fee: { type: String, default: "As per Govt / MeeSeva norms" },
    officeLocation: { type: String, default: "Village Secretariat / MeeSeva" },
    downloadUrl: { type: String, default: null },
  },
  { timestamps: true, versionKey: false }
);

const SchemeSchema = new Schema<SchemeDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    villageId: { type: String, default: "all", index: true },
    name: { type: String, required: true, trim: true },
    nameTe: { type: String, default: "", trim: true },
    category: { type: String, default: "Welfare" },
    benefits: { type: String, default: "", trim: true },
    benefitsTe: { type: String, default: "", trim: true },
    eligibility: { type: String, required: true, trim: true },
    eligibilityTe: { type: String, default: "", trim: true },
    documents: { type: [String], default: [] },
    steps: { type: [String], default: [] },
    officialUrl: { type: String, default: null },
  },
  { timestamps: true, versionKey: false }
);

export const CertificateItem =
  mongoose.models.CertificateItem ||
  mongoose.model<CertificateDocument>("CertificateItem", CertificateSchema, "certificates");

export const SchemeItem =
  mongoose.models.SchemeItem ||
  mongoose.model<SchemeDocument>("SchemeItem", SchemeSchema, "schemes");

