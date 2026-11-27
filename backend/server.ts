/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import "dotenv/config";
import express from "express";
import path from "path";
import fs from "fs";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import cors from "cors";
import mongoose from "mongoose";
import { connectDB } from "./config/db";
import { Village } from "./models/Village";
import { Message } from "./models/Message";
import { User } from "./models/User";
import { CertificateItem, SchemeItem } from "./models/ServiceCatalog";
import { seedDatabase } from "./seed";

const PORT = parseInt(process.env.PORT || "3000", 10);
const DEFAULT_DEV_JWT_SECRET = "vendra_secret_key_2026_govt_portal";
const JWT_SECRET = process.env.JWT_SECRET || DEFAULT_DEV_JWT_SECRET;

const ALLOWED_SECTION_KEYS = new Set([
  "stats",
  "infrastructure",
  "land",
  "water",
  "education",
  "health",
  "ration",
  "shg",
  "pensions",
  "voters",
  "about",
  "location",
]);

function normalizeVillage(v: any) {
  const village = { ...v };
  delete village._id;
  delete village.createdAt;
  delete village.updatedAt;

  village.socialCategories = village.socialCategories || {
    scPopulation: village.demographics?.scPopulation ?? null,
    stPopulation: village.demographics?.stPopulation ?? null,
  };

  if (!village.hospitals || typeof village.hospitals !== "object" || Array.isArray(village.hospitals)) {
    village.hospitals = { municipal: {}, government: {}, private: {}, total: {} };
  } else {
    const h = village.hospitals;
    if (typeof h.government === "number" || typeof h.private === "number" || typeof h.total === "number") {
      village.hospitals = {
        municipal: h.municipal || { allopathic: 0, homeopathic: 0, ayurvedic: 0, unani: 0, veterinary: 0, total: 0 },
        government:
          typeof h.government === "object"
            ? h.government
            : { allopathic: h.government ?? null, veterinary: null, total: h.government ?? null },
        private:
          typeof h.private === "object"
            ? h.private
            : { allopathic: h.private ?? null, total: h.private ?? null },
        total:
          typeof h.total === "object"
            ? h.total
            : { allopathic: h.total ?? null, veterinary: null, total: h.total ?? null },
      };
    }
  }

  village.educationDetailed = village.educationDetailed || {
    schools: {
      zpMpElementary: village.education?.elementarySchools ?? village.education?.govtSchools ?? null,
      zpMpUpperPrimary: village.education?.upperPrimary ?? null,
      zpMpHighSchools: village.education?.highSchools ?? null,
      privateHighSchools: null,
      totalSchools: null,
    },
    colleges: {
      governmentJuniorColleges: village.education?.juniorColleges ?? null,
      privateDegreeColleges: null,
      totalColleges: null,
    },
    trainingCentres: village.education?.trainingCentres
      ? { others: village.education.trainingCentres }
      : {},
  };

  village.markets = village.markets || {
    vegetableMarkets: null,
    fruitMarkets: null,
    flowerMarkets: null,
    rythuBazars: null,
    muttonMarkets: null,
    fishMarkets: null,
    others: null,
    totalMarkets: null,
  };
  village.burialGrounds = village.burialGrounds || {
    hindu: null,
    muslim: null,
    christian: null,
    others: null,
    total: null,
  };
  village.parks = village.parks || { totalParks: null };
  village.waterBodies = village.waterBodies || {
    municipalTanks: null,
    governmentTanks: null,
    otherTanks: null,
    totalTanks: null,
  };
  village.streetLights = village.streetLights || {
    highMastJunctions: null,
    svLamps: null,
    mvLamps: null,
    tubeLights: null,
    solarLights: null,
    ledLights: null,
    totalLights: null,
    polesWithoutLights: null,
  };
  village.trade = village.trade || {
    doTrades: null,
    doTradeDemand: null,
    hotels: null,
    lodges: null,
    theatres: null,
    functionHalls: null,
    fireStations: null,
  };
  village.planning = village.planning || { approvedLayoutPlans: null, layoutOpenSpaces: null };
  // Public /api/data never leaks private citizen grievance contact details
  village.messages = [];

  return village;
}

const asyncHandler =
  (fn: (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

function normalizeOriginEntry(entry: string): string[] {
  const cleaned = entry.trim().replace(/\/+$/, "");
  if (!cleaned) return [];
  if (/^https?:\/\//i.test(cleaned)) return [cleaned];
  return [`http://${cleaned}`, `https://${cleaned}`];
}

function parseCorsOrigin(raw?: string): boolean | string[] {
  if (!raw || !raw.trim()) return true;
  const trimmed = raw.trim();
  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.flatMap((item) => normalizeOriginEntry(String(item)));
      }
    } catch {
      // Fall back to comma-separated parsing
    }
  }
  return trimmed.split(",").flatMap(normalizeOriginEntry);
}

function sanitizeUser(user: any) {
  return {
    username: user.username,
    role: user.role,
    fullName: user.fullName,
    phone: user.phone || "",
    email: user.email || "",
    villageId: user.villageId || "vendra",
    ward: user.ward || "",
    savedCertificates: user.savedCertificates || [],
    savedSchemes: user.savedSchemes || [],
  };
}

function signUserToken(user: any) {
  return jsonwebtoken.sign(
    {
      username: user.username,
      role: user.role,
      fullName: user.fullName,
      villageId: user.villageId,
    },
    JWT_SECRET,
    { expiresIn: "24h" }
  );
}

function normalizeStringArray(val: unknown): string[] {
  if (Array.isArray(val)) {
    return val.map((v) => String(v).trim()).filter(Boolean);
  }
  if (typeof val === "string") {
    return val
      .split(/\r?\n|,/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

async function startServer() {
  if (process.env.NODE_ENV === "production" && JWT_SECRET === DEFAULT_DEV_JWT_SECRET) {
    console.warn("[Security] Using default JWT_SECRET in production. Set JWT_SECRET in your environment.");
  }

  await connectDB();
  await seedDatabase(false);

  const app = express();
  app.use(express.json({ limit: "50mb" }));
  const corsOrigin = parseCorsOrigin(process.env.CORS_ORIGIN);
  app.use(cors({ origin: corsOrigin, credentials: true }));

  // Middleware: Verify JWT
  const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({ error: "Access token missing" });
      return;
    }

    jsonwebtoken.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(403).json({ error: "Invalid or expired token" });
        return;
      }
      (req as any).user = decoded;
      next();
    });
  };

  // Middleware: Require Admin role
  const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const role = (req as any).user?.role;
    if (role !== "admin" && role !== "administrator") {
      res.status(403).json({ error: "Administrator privileges required" });
      return;
    }
    next();
  };

  // --- HEALTHCHECK ---
  app.get("/api/health", (_req, res) => {
    const dbState = mongoose.connection.readyState;
    res.json({
      status: dbState === 1 ? "ok" : "degraded",
      database: dbState === 1 ? "connected" : "disconnected",
    });
  });

  // --- AUTHENTICATION API (Admin & Citizen) ---
  app.post(
    "/api/auth/login",
    asyncHandler(async (req, res) => {
      const { username, password, expectedRole } = req.body;
      if (!username || !password) {
        res.status(400).json({ error: "Username and password required" });
        return;
      }

      const normalizedUsername = String(username).trim().toLowerCase();
      const user = await User.findOne({ username: normalizedUsername });

      if (!user || !bcryptjs.compareSync(String(password), user.passwordHash)) {
        res.status(401).json({ error: "Invalid username or password" });
        return;
      }

      if (expectedRole && user.role !== expectedRole) {
        res.status(403).json({
          error:
            expectedRole === "admin"
              ? "This account is a Citizen account. Please use Citizen Login."
              : "Please sign in with a Citizen account here.",
        });
        return;
      }

      const token = signUserToken(user);
      const profile = sanitizeUser(user);
      res.json({
        token,
        username: profile.username,
        role: profile.role,
        user: profile,
      });
    })
  );

  app.post(
    "/api/auth/register",
    asyncHandler(async (req, res) => {
      const { username, password, fullName, phone, email, villageId, ward } = req.body;
      if (!username || !password || !fullName || !phone) {
        res.status(400).json({ error: "Full name, username, phone, and password are required." });
        return;
      }
      if (String(password).length < 6) {
        res.status(400).json({ error: "Password must be at least 6 characters." });
        return;
      }

      const normalizedUsername = String(username).trim().toLowerCase();
      const existing = await User.findOne({ username: normalizedUsername });
      if (existing) {
        res.status(409).json({ error: "Username is already registered. Please choose another." });
        return;
      }

      const passwordHash = bcryptjs.hashSync(String(password), 10);
      const created = await User.create({
        username: normalizedUsername,
        passwordHash,
        role: "citizen",
        fullName: String(fullName).trim(),
        phone: String(phone).trim(),
        email: email ? String(email).trim() : "",
        villageId: villageId || "vendra",
        ward: ward ? String(ward).trim() : "",
      });

      const token = signUserToken(created);
      const profile = sanitizeUser(created);
      res.status(201).json({ token, role: profile.role, user: profile });
    })
  );

  app.get(
    "/api/auth/verify",
    authenticateToken,
    asyncHandler(async (req, res) => {
      const username = (req as any).user?.username;
      const user = await User.findOne({ username }).lean();
      if (!user) {
        res.status(401).json({ error: "User account no longer exists" });
        return;
      }
      res.json({ status: "authorized", user: sanitizeUser(user) });
    })
  );

  // --- CITIZEN BOOKMARKS / CHECKLIST ---
  app.post(
    "/api/citizen/bookmarks",
    authenticateToken,
    asyncHandler(async (req, res) => {
      const username = (req as any).user?.username;
      const { type, itemId } = req.body;
      if (!itemId || (type !== "certificate" && type !== "scheme")) {
        res.status(400).json({ error: "Valid type ('certificate' | 'scheme') and itemId are required." });
        return;
      }

      const user = await User.findOne({ username });
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const field = type === "certificate" ? "savedCertificates" : "savedSchemes";
      const list = [...(user[field] || [])];
      const idx = list.indexOf(itemId);
      if (idx >= 0) {
        list.splice(idx, 1);
      } else {
        list.push(itemId);
      }
      user[field] = list;
      await user.save();

      res.json({ user: sanitizeUser(user), saved: idx === -1 });
    })
  );

  // --- DATA GET & FETCH API ---
  app.get(
    "/api/data",
    asyncHandler(async (_req, res) => {
      const villages = await Village.find({}).lean();
      res.json({ villages: villages.map(normalizeVillage) });
    })
  );

  // --- CITIZEN SERVICES: CERTIFICATES & SCHEMES ---
  app.get(
    "/api/services",
    asyncHandler(async (req, res) => {
      const villageId = req.query.villageId as string | undefined;
      const filter = villageId ? { villageId: { $in: ["all", villageId] } } : {};
      const [certificates, schemes] = await Promise.all([
        CertificateItem.find(filter, { _id: 0 }).sort({ createdAt: 1 }).lean(),
        SchemeItem.find(filter, { _id: 0 }).sort({ createdAt: 1 }).lean(),
      ]);
      res.json({ certificates, schemes });
    })
  );

  app.post(
    "/api/services/certificates",
    authenticateToken,
    requireAdmin,
    asyncHandler(async (req, res) => {
      const { name, nameTe, description, descriptionTe, category, documents, steps, processingTime, fee, officeLocation, downloadUrl, villageId } = req.body;
      if (!name || !description) {
        res.status(400).json({ error: "Certificate name and description are required." });
        return;
      }

      const created = await CertificateItem.create({
        id: "cert-" + Date.now(),
        villageId: villageId || "all",
        name: String(name).trim(),
        nameTe: nameTe ? String(nameTe).trim() : "",
        description: String(description).trim(),
        descriptionTe: descriptionTe ? String(descriptionTe).trim() : "",
        category: ["identity", "welfare", "records", "revenue"].includes(category) ? category : "identity",
        documents: normalizeStringArray(documents),
        steps: normalizeStringArray(steps),
        processingTime: processingTime || "7 - 15 Working Days",
        fee: fee || "As per Govt / MeeSeva norms",
        officeLocation: officeLocation || "Village Secretariat / MeeSeva",
        downloadUrl: downloadUrl ? String(downloadUrl).trim() : null,
      });

      const item = created.toObject();
      delete (item as any)._id;
      res.status(201).json({ message: "Certificate guide added", item });
    })
  );

  app.put(
    "/api/services/certificates/:id",
    authenticateToken,
    requireAdmin,
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const existing = await CertificateItem.findOne({ id });
      if (!existing) {
        res.status(404).json({ error: "Certificate guide not found" });
        return;
      }

      if (req.body.name !== undefined) existing.name = String(req.body.name).trim();
      if (req.body.nameTe !== undefined) existing.nameTe = String(req.body.nameTe).trim();
      if (req.body.description !== undefined) existing.description = String(req.body.description).trim();
      if (req.body.descriptionTe !== undefined) existing.descriptionTe = String(req.body.descriptionTe).trim();
      if (req.body.category !== undefined) existing.category = req.body.category;
      if (req.body.documents !== undefined) existing.documents = normalizeStringArray(req.body.documents);
      if (req.body.steps !== undefined) existing.steps = normalizeStringArray(req.body.steps);
      if (req.body.processingTime !== undefined) existing.processingTime = String(req.body.processingTime).trim();
      if (req.body.fee !== undefined) existing.fee = String(req.body.fee).trim();
      if (req.body.officeLocation !== undefined) existing.officeLocation = String(req.body.officeLocation).trim();
      if (req.body.downloadUrl !== undefined) existing.downloadUrl = req.body.downloadUrl ? String(req.body.downloadUrl).trim() : null;
      if (req.body.villageId !== undefined) existing.villageId = req.body.villageId || "all";

      await existing.save();
      const item = existing.toObject();
      delete (item as any)._id;
      res.json({ message: "Certificate guide updated", item });
    })
  );

  app.delete(
    "/api/services/certificates/:id",
    authenticateToken,
    requireAdmin,
    asyncHandler(async (req, res) => {
      const deleted = await CertificateItem.findOneAndDelete({ id: req.params.id });
      if (!deleted) {
        res.status(404).json({ error: "Certificate guide not found" });
        return;
      }
      res.json({ message: "Certificate guide deleted" });
    })
  );

  app.post(
    "/api/services/schemes",
    authenticateToken,
    requireAdmin,
    asyncHandler(async (req, res) => {
      const { name, nameTe, category, benefits, benefitsTe, eligibility, eligibilityTe, documents, steps, officialUrl, villageId } = req.body;
      if (!name || !eligibility) {
        res.status(400).json({ error: "Scheme name and eligibility are required." });
        return;
      }

      const created = await SchemeItem.create({
        id: "scheme-" + Date.now(),
        villageId: villageId || "all",
        name: String(name).trim(),
        nameTe: nameTe ? String(nameTe).trim() : "",
        category: category || "Welfare",
        benefits: benefits ? String(benefits).trim() : "",
        benefitsTe: benefitsTe ? String(benefitsTe).trim() : "",
        eligibility: String(eligibility).trim(),
        eligibilityTe: eligibilityTe ? String(eligibilityTe).trim() : "",
        documents: normalizeStringArray(documents),
        steps: normalizeStringArray(steps),
        officialUrl: officialUrl ? String(officialUrl).trim() : null,
      });

      const item = created.toObject();
      delete (item as any)._id;
      res.status(201).json({ message: "Government scheme added", item });
    })
  );

  app.put(
    "/api/services/schemes/:id",
    authenticateToken,
    requireAdmin,
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const existing = await SchemeItem.findOne({ id });
      if (!existing) {
        res.status(404).json({ error: "Government scheme not found" });
        return;
      }

      if (req.body.name !== undefined) existing.name = String(req.body.name).trim();
      if (req.body.nameTe !== undefined) existing.nameTe = String(req.body.nameTe).trim();
      if (req.body.category !== undefined) existing.category = String(req.body.category).trim();
      if (req.body.benefits !== undefined) existing.benefits = String(req.body.benefits).trim();
      if (req.body.benefitsTe !== undefined) existing.benefitsTe = String(req.body.benefitsTe).trim();
      if (req.body.eligibility !== undefined) existing.eligibility = String(req.body.eligibility).trim();
      if (req.body.eligibilityTe !== undefined) existing.eligibilityTe = String(req.body.eligibilityTe).trim();
      if (req.body.documents !== undefined) existing.documents = normalizeStringArray(req.body.documents);
      if (req.body.steps !== undefined) existing.steps = normalizeStringArray(req.body.steps);
      if (req.body.officialUrl !== undefined) existing.officialUrl = req.body.officialUrl ? String(req.body.officialUrl).trim() : null;
      if (req.body.villageId !== undefined) existing.villageId = req.body.villageId || "all";

      await existing.save();
      const item = existing.toObject();
      delete (item as any)._id;
      res.json({ message: "Government scheme updated", item });
    })
  );

  app.delete(
    "/api/services/schemes/:id",
    authenticateToken,
    requireAdmin,
    asyncHandler(async (req, res) => {
      const deleted = await SchemeItem.findOneAndDelete({ id: req.params.id });
      if (!deleted) {
        res.status(404).json({ error: "Government scheme not found" });
        return;
      }
      res.json({ message: "Government scheme deleted" });
    })
  );

  // --- CRUD: Village Section Updates (Stats, Infrastructure, Land, etc.) ---
  app.put(
    "/api/data/sections",
    authenticateToken,
    requireAdmin,
    asyncHandler(async (req, res) => {
      const { villageId, key, payload } = req.body;

      if (!key || !payload || typeof payload !== "object") {
        res.status(400).json({ error: "Key and payload object are required." });
        return;
      }

      if (!ALLOWED_SECTION_KEYS.has(key)) {
        res.status(400).json({ error: `Invalid section: ${key}` });
        return;
      }

      const targetVillageId = villageId || "vendra";
      const village = await Village.findOne({ id: targetVillageId });
      if (!village) {
        res.status(404).json({ error: `Village not found: ${targetVillageId}` });
        return;
      }

      const existingSection = (village.get(key) as Record<string, any>) || {};
      const mergedSection = { ...existingSection, ...payload };
      village.set(key, mergedSection);
      village.markModified(key);
      await village.save();

      res.json({ message: `Section [${key}] successfully updated`, data: mergedSection });
    })
  );

  // --- CRUD: STAFF (Village-scoped) ---
  app.post(
    "/api/staff",
    authenticateToken,
    requireAdmin,
    asyncHandler(async (req, res) => {
      const { villageId, name, designation, contact, department } = req.body;
      if (!name || !designation || !contact) {
        res.status(400).json({ error: "Name, designation, and contact are required." });
        return;
      }

      const newStaff = {
        id: "staff-" + Date.now(),
        name,
        designation,
        contact,
        department: department || "Sachivalayam",
      };

      const targetVillageId = villageId || "vendra";
      const updated = await Village.findOneAndUpdate(
        { id: targetVillageId },
        { $push: { staff: newStaff } },
        { new: true }
      );

      if (!updated) {
        res.status(404).json({ error: `Village not found: ${targetVillageId}` });
        return;
      }

      res.status(201).json({ message: "Staff added", item: newStaff });
    })
  );

  app.put(
    "/api/staff/:id",
    authenticateToken,
    requireAdmin,
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const villageId = (req.body.villageId as string) || (req.query.villageId as string);
      const query = villageId ? { id: villageId, "staff.id": id } : { "staff.id": id };

      const village = await Village.findOne(query);
      if (!village) {
        res.status(404).json({ error: "Staff member not found" });
        return;
      }

      const index = village.staff.findIndex((s: any) => s.id === id);
      if (index === -1) {
        res.status(404).json({ error: "Staff member not found" });
        return;
      }

      const current = village.staff[index];
      village.staff[index] = {
        id: current.id,
        name: req.body.name || current.name,
        designation: req.body.designation || current.designation,
        contact: req.body.contact || current.contact,
        department: req.body.department || current.department,
      };
      await village.save();

      res.json({ message: "Staff updated", item: village.staff[index] });
    })
  );

  app.delete(
    "/api/staff/:id",
    authenticateToken,
    requireAdmin,
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const villageId = (req.query.villageId as string) || (req.body?.villageId as string);
      const query = villageId ? { id: villageId, "staff.id": id } : { "staff.id": id };

      const updated = await Village.findOneAndUpdate(query, { $pull: { staff: { id } } }, { new: true });
      if (!updated) {
        res.status(404).json({ error: "Staff member not found" });
        return;
      }

      res.json({ message: "Staff deleted successfully" });
    })
  );

  // --- CRUD: ANNOUNCEMENTS (Village-scoped) ---
  app.post(
    "/api/announcements",
    authenticateToken,
    requireAdmin,
    asyncHandler(async (req, res) => {
      const { villageId, title, content, category, date } = req.body;
      if (!title || !content) {
        res.status(400).json({ error: "Title and content are required." });
        return;
      }

      const newAnn = {
        id: "ann-" + Date.now(),
        title,
        content,
        category: category || "General",
        date: date || new Date().toISOString().split("T")[0],
      };

      const targetVillageId = villageId || "vendra";
      const updated = await Village.findOneAndUpdate(
        { id: targetVillageId },
        { $push: { announcements: { $each: [newAnn], $position: 0 } } },
        { new: true }
      );

      if (!updated) {
        res.status(404).json({ error: `Village not found: ${targetVillageId}` });
        return;
      }

      res.status(201).json({ message: "Announcement created", item: newAnn });
    })
  );

  app.put(
    "/api/announcements/:id",
    authenticateToken,
    requireAdmin,
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const villageId = (req.body.villageId as string) || (req.query.villageId as string);
      const query = villageId ? { id: villageId, "announcements.id": id } : { "announcements.id": id };

      const village = await Village.findOne(query);
      if (!village) {
        res.status(404).json({ error: "Announcement not found" });
        return;
      }

      const index = village.announcements.findIndex((a: any) => a.id === id);
      if (index === -1) {
        res.status(404).json({ error: "Announcement not found" });
        return;
      }

      const current = village.announcements[index];
      village.announcements[index] = {
        id: current.id,
        title: req.body.title || current.title,
        content: req.body.content || current.content,
        category: req.body.category || current.category,
        date: req.body.date || current.date,
      };
      await village.save();

      res.json({ message: "Announcement updated", item: village.announcements[index] });
    })
  );

  app.delete(
    "/api/announcements/:id",
    authenticateToken,
    requireAdmin,
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const villageId = (req.query.villageId as string) || (req.body?.villageId as string);
      const query = villageId ? { id: villageId, "announcements.id": id } : { "announcements.id": id };

      const updated = await Village.findOneAndUpdate(
        query,
        { $pull: { announcements: { id } } },
        { new: true }
      );

      if (!updated) {
        res.status(404).json({ error: "Announcement not found" });
        return;
      }

      res.json({ message: "Announcement deleted" });
    })
  );

  // --- CRUD: GALLERY (Village-scoped) ---
  app.post(
    "/api/gallery",
    authenticateToken,
    requireAdmin,
    asyncHandler(async (req, res) => {
      const { villageId, title, category, imageUrl } = req.body;
      if (!imageUrl) {
        res.status(400).json({ error: "Image URL or data is required." });
        return;
      }

      const newGal = {
        id: "gal-" + Date.now(),
        title: title || "Gallery Image",
        category: category || "Infrastructure",
        imageUrl,
      };

      const targetVillageId = villageId || "vendra";
      const updated = await Village.findOneAndUpdate(
        { id: targetVillageId },
        { $push: { gallery: newGal } },
        { new: true }
      );

      if (!updated) {
        res.status(404).json({ error: `Village not found: ${targetVillageId}` });
        return;
      }

      res.status(201).json({ message: "Gallery image added", item: newGal });
    })
  );

  app.delete(
    "/api/gallery/:id",
    authenticateToken,
    requireAdmin,
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const villageId = (req.query.villageId as string) || (req.body?.villageId as string);
      const query = villageId ? { id: villageId, "gallery.id": id } : { "gallery.id": id };

      const updated = await Village.findOneAndUpdate(
        query,
        { $pull: { gallery: { id } } },
        { new: true }
      );

      if (!updated) {
        res.status(404).json({ error: "Image not found" });
        return;
      }

      res.json({ message: "Gallery item removed" });
    })
  );

  // --- CRUD: CONTACT MESSAGES / GRIEVANCES (MongoDB Collection) ---
  app.post(
    "/api/messages",
    asyncHandler(async (req, res) => {
      const { villageId, name, email, phone, message } = req.body;

      if (!name || !phone || !message) {
        res.status(400).json({ error: "Name, phone, and message are required." });
        return;
      }

      // Link to logged-in citizen if valid Bearer token is included
      let citizenUsername = "";
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];
      if (token) {
        try {
          const decoded = jsonwebtoken.verify(token, JWT_SECRET) as any;
          if (decoded?.username) {
            citizenUsername = String(decoded.username);
          }
        } catch {
          // Ignore invalid optional token on public grievance form
        }
      }

      const created = await Message.create({
        id: "msg-" + Date.now(),
        villageId: villageId || "vendra",
        citizenUsername,
        name,
        email: email || "",
        phone,
        message,
        status: "unread",
        adminRemarks: "",
        date: new Date().toISOString().split("T")[0],
      });

      const item = created.toObject();
      delete (item as any)._id;
      res.status(201).json({ message: "Message sent successfully", item });
    })
  );

  // Logged-in Citizen: view own grievances & official status/remarks
  app.get(
    "/api/messages/mine",
    authenticateToken,
    asyncHandler(async (req, res) => {
      const username = (req as any).user?.username;
      const user = await User.findOne({ username }).lean();
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const orFilters: Record<string, any>[] = [{ citizenUsername: username }];
      if (user.phone) {
        orFilters.push({ phone: user.phone });
      }

      const messages = await Message.find({ $or: orFilters }, { _id: 0 }).sort({ createdAt: -1 }).lean();
      res.json(messages);
    })
  );

  app.get(
    "/api/messages",
    authenticateToken,
    requireAdmin,
    asyncHandler(async (req, res) => {
      const villageId = req.query.villageId as string | undefined;
      const filter = villageId ? { villageId } : {};
      const messages = await Message.find(filter, { _id: 0 }).sort({ createdAt: -1 }).lean();
      res.json(messages);
    })
  );

  app.put(
    "/api/messages/:id",
    authenticateToken,
    requireAdmin,
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const { status, adminRemarks } = req.body;
      const updateFields: Record<string, any> = {};
      if (status !== undefined) {
        updateFields.status = ["unread", "read", "resolved"].includes(status) ? status : "read";
      }
      if (adminRemarks !== undefined) {
        updateFields.adminRemarks = String(adminRemarks).trim();
      }

      const updated = await Message.findOneAndUpdate(
        { id },
        { $set: updateFields },
        { new: true, projection: { _id: 0 } }
      ).lean();

      if (!updated) {
        res.status(404).json({ error: "Message not found" });
        return;
      }

      res.json({ message: "Message status updated", item: updated });
    })
  );

  app.delete(
    "/api/messages/:id",
    authenticateToken,
    requireAdmin,
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const deleted = await Message.findOneAndDelete({ id });

      if (!deleted) {
        res.status(404).json({ error: "Message not found" });
        return;
      }

      res.json({ message: "Message deleted" });
    })
  );

  // --- VITE / STATIC FRONTEND CONFIGURATION ---
  if (process.env.NODE_ENV !== "production" && fs.existsSync(path.join(process.cwd(), "index.html"))) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use((vite as any).middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    const indexFile = path.join(distPath, "index.html");
    if (process.env.NODE_ENV === "production" && fs.existsSync(distPath) && fs.existsSync(indexFile)) {
      app.use(express.static(distPath));
      app.get("/*", (_req, res) => {
        res.sendFile(indexFile);
      });
    } else {
      app.get("/", (_req, res) => {
        res.json({
          status: "ok",
          mode: "api-only",
          message: "Backend API is running. Open the Vite frontend at http://localhost:5173",
          endpoints: ["/api/health", "/api/data", "/api/services"],
        });
      });
    }
  }

  // Global error handler
  app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
    try {
      console.error("Unhandled server error:", err, {
        path: req.path,
        method: req.method,
        bodyPreview: req.body && typeof req.body === "object" ? JSON.stringify(req.body).slice(0, 200) : String(req.body),
      });
    } catch (logErr) {
      console.error("Error while logging unhandled error", logErr);
    }
    res.status(500).json({ error: "Internal server error" });
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Digital Panchayat Portal Server] Running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("[Server] Failed to start:", err);
  process.exit(1);
});
