/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import mongoose from "mongoose";

const DEFAULT_MONGODB_URI = "mongodb://127.0.0.1:27017/digital_panchayat";

/**
 * Connects to MongoDB using MONGODB_URI (or local default) and reuses an active connection.
 */
export async function connectDB(): Promise<typeof mongoose> {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  const uri = process.env.MONGODB_URI || DEFAULT_MONGODB_URI;
  if (!process.env.MONGODB_URI) {
    console.warn(`[MongoDB] MONGODB_URI not set; defaulting to ${DEFAULT_MONGODB_URI}`);
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  console.log(`[MongoDB] Connected to ${mongoose.connection.name}`);
  return mongoose;
}

