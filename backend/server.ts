/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
// Import Vite dynamically in dev only to avoid loading Vite in production bundles
import cors from "cors";
import { DatabaseSchema } from "../src/types";

const PORT = parseInt(process.env.PORT || "3000", 10);
const JWT_SECRET = process.env.JWT_SECRET || "vendra_secret_key_2026_govt_portal";
const DB_PATH = path.join(process.cwd(), "db.json");

// Default password 'password123' bcrypt hash
const DEFAULT_ADMIN_HASH = "$2b$10$rI75Oi7p.NPtLg2/mLos5eTv1CpMQjMc34MIAnUNOeo.1DdZy3CDi";

function readDB(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_PATH)) {
      console.error("Database file missing, creating empty one.");
      return {} as DatabaseSchema;
    }
    const data = fs.readFileSync(DB_PATH, "utf8");
    return JSON.parse(data) as DatabaseSchema;
  } catch (err) {
    console.error("Error reading database", err);
    return {} as DatabaseSchema;
  }
}

function writeDB(data: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("Error writing to database", err);
    return false;
  }
}

// Ensure the db contains a initial database structure when blank
if (!fs.existsSync(DB_PATH)) {
  console.log("No db.json found, setting up defaults");
  const defaultLayout = {
    stats: { population: 3115, areaSqKm: 5.72, totalWards: 12, totalHouseholds: 1109 },
    officials: [],
    wardMembers: [],
    voters: {},
    staff: [],
    land: {},
    education: {},
    health: {},
    water: {},
    ration: {},
    shg: {},
    pensions: {},
    infrastructure: {},
    announcements: [],
    gallery: [],
    messages: []
  };
  fs.writeFileSync(DB_PATH, JSON.stringify(defaultLayout, null, 2), "utf8");
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "50mb" }));
  const corsOrigin = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : true;
  app.use(cors({ origin: corsOrigin, credentials: true }));

  // Middleware: Authenticate Admin via JWT
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

  // --- AUTHENTICATION API ---
  app.post("/api/auth/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ error: "Username and password required" });
      return;
    }

    if (username === "admin") {
      const isMatch = bcryptjs.compareSync(password, DEFAULT_ADMIN_HASH);
      if (isMatch) {
        const token = jsonwebtoken.sign({ username: "admin", role: "administrator" }, JWT_SECRET, {
          expiresIn: "24h",
        });
        res.json({ token, username: "admin", role: "administrator" });
        return;
      }
    }
    res.status(401).json({ error: "Invalid username or password" });
  });

  app.get("/api/auth/verify", authenticateToken, (req, res) => {
    res.json({ status: "authorized", user: (req as any).user });
  });

  // --- DATA GET & FETCH API ---
  app.get("/api/data", (req, res) => {
    try {
      const db: any = readDB();

      // Normalize village entries: ensure new keys exist across all villages so UI can safely read them.
      if (db && Array.isArray(db.villages)) {
        db.villages = db.villages.map((v: any) => {
          // socialCategories (derive from demographics when available)
          v.socialCategories = v.socialCategories || {
            scPopulation: v.demographics?.scPopulation ?? null,
            stPopulation: v.demographics?.stPopulation ?? null,
          };

          // hospitals: normalize to detailed shape if only simple counts present
          if (!v.hospitals || typeof v.hospitals !== "object" || Array.isArray(v.hospitals)) {
            v.hospitals = { municipal: {}, government: {}, private: {}, total: {} };
          } else {
            // if existing structure is simple counts, promote them
            const h = v.hospitals;
            if (typeof h.government === "number" || typeof h.private === "number" || typeof h.total === "number") {
              v.hospitals = {
                municipal: h.municipal || { allopathic: 0, homeopathic: 0, ayurvedic: 0, unani: 0, veterinary: 0, total: 0 },
                government: typeof h.government === "object" ? h.government : { allopathic: h.government ?? null, veterinary: null, total: h.government ?? null },
                private: typeof h.private === "object" ? h.private : { allopathic: h.private ?? null, total: h.private ?? null },
                total: typeof h.total === "object" ? h.total : { allopathic: h.total ?? null, veterinary: null, total: h.total ?? null },
              };
            }
          }

          // educationDetailed: provide nested structure derived from existing `education` when available
          v.educationDetailed = v.educationDetailed || {
            schools: {
              zpMpElementary: v.education?.elementarySchools ?? v.education?.govtSchools ?? null,
              zpMpUpperPrimary: v.education?.upperPrimary ?? null,
              zpMpHighSchools: v.education?.highSchools ?? null,
              privateHighSchools: null,
              totalSchools: null,
            },
            colleges: {
              governmentJuniorColleges: v.education?.juniorColleges ?? null,
              privateDegreeColleges: null,
              totalColleges: null,
            },
            trainingCentres: v.education?.trainingCentres ? { others: v.education.trainingCentres as any } : {},
          };

          // Markets, burial grounds, parks, water bodies, street lights, trade, planning - empty defaults
          v.markets = v.markets || { vegetableMarkets: null, fruitMarkets: null, flowerMarkets: null, rythuBazars: null, muttonMarkets: null, fishMarkets: null, others: null, totalMarkets: null };
          v.burialGrounds = v.burialGrounds || { hindu: null, muslim: null, christian: null, others: null, total: null };
          v.parks = v.parks || { totalParks: null };
          v.waterBodies = v.waterBodies || { municipalTanks: null, governmentTanks: null, otherTanks: null, totalTanks: null };
          v.streetLights = v.streetLights || { highMastJunctions: null, svLamps: null, mvLamps: null, tubeLights: null, solarLights: null, ledLights: null, totalLights: null, polesWithoutLights: null };
          v.trade = v.trade || { doTrades: null, doTradeDemand: null, hotels: null, lodges: null, theatres: null, functionHalls: null, fireStations: null };
          v.planning = v.planning || { approvedLayoutPlans: null, layoutOpenSpaces: null };

          return v;
        });
      }

      res.json(db);
    } catch (err) {
      console.error("Error handling /api/data", { err, path: req.path, method: req.method, headers: req.headers });
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // --- CRUD: Stats, Land, Infrastructure, Pensions, SHGs ---
  app.put("/api/data/sections", authenticateToken, (req, res) => {
    const db = readDB();
    const { key, payload } = req.body;

    if (!key || !payload) {
      res.status(400).json({ error: "Key and payload are required." });
      return;
    }

    if (!(key in db)) {
      res.status(400).json({ error: `Invalid section: ${key}` });
      return;
    }

    db[key] = { ...db[key], ...payload };
    writeDB(db);
    res.json({ message: `Section [${key}] successfully updated`, data: db[key] });
  });

  // --- CRUD: STAFF ---
  app.post("/api/staff", authenticateToken, (req, res) => {
    const db = readDB();
    const newStaff = {
      id: "staff-" + Date.now(),
      name: req.body.name,
      designation: req.body.designation,
      contact: req.body.contact,
      department: req.body.department || "Sachivalayam",
    };

    if (!newStaff.name || !newStaff.designation || !newStaff.contact) {
      res.status(400).json({ error: "Name, designation, and contact are required." });
      return;
    }

    db.staff = db.staff || [];
    db.staff.push(newStaff);
    writeDB(db);
    res.status(201).json({ message: "Staff added", item: newStaff });
  });

  app.put("/api/staff/:id", authenticateToken, (req, res) => {
    const db = readDB();
    const { id } = req.params;
    db.staff = db.staff || [];
    const index = db.staff.findIndex((s) => s.id === id);

    if (index === -1) {
      res.status(404).json({ error: "Staff member not found" });
      return;
    }

    db.staff[index] = {
      ...db.staff[index],
      name: req.body.name || db.staff[index].name,
      designation: req.body.designation || db.staff[index].designation,
      contact: req.body.contact || db.staff[index].contact,
      department: req.body.department || db.staff[index].department,
    };

    writeDB(db);
    res.json({ message: "Staff updated", item: db.staff[index] });
  });

  app.delete("/api/staff/:id", authenticateToken, (req, res) => {
    const db = readDB();
    const { id } = req.params;
    db.staff = db.staff || [];
    const filtered = db.staff.filter((s) => s.id !== id);

    if (filtered.length === db.staff.length) {
      res.status(404).json({ error: "Staff member not found" });
      return;
    }

    db.staff = filtered;
    writeDB(db);
    res.json({ message: "Staff deleted successfully" });
  });

  // --- CRUD: ANNOUNCEMENTS ---
  app.post("/api/announcements", authenticateToken, (req, res) => {
    const db = readDB();
    const newAnn = {
      id: "ann-" + Date.now(),
      title: req.body.title,
      content: req.body.content,
      category: req.body.category || "General",
      date: req.body.date || new Date().toISOString().split("T")[0],
    };

    if (!newAnn.title || !newAnn.content) {
      res.status(400).json({ error: "Title and content are required." });
      return;
    }

    db.announcements = db.announcements || [];
    db.announcements.unshift(newAnn);
    writeDB(db);
    res.status(201).json({ message: "Announcement created", item: newAnn });
  });

  app.put("/api/announcements/:id", authenticateToken, (req, res) => {
    const db = readDB();
    const { id } = req.params;
    db.announcements = db.announcements || [];
    const index = db.announcements.findIndex((a) => a.id === id);

    if (index === -1) {
      res.status(404).json({ error: "Announcement not found" });
      return;
    }

    db.announcements[index] = {
      ...db.announcements[index],
      title: req.body.title || db.announcements[index].title,
      content: req.body.content || db.announcements[index].content,
      category: req.body.category || db.announcements[index].category,
      date: req.body.date || db.announcements[index].date,
    };

    writeDB(db);
    res.json({ message: "Announcement updated", item: db.announcements[index] });
  });

  app.delete("/api/announcements/:id", authenticateToken, (req, res) => {
    const db = readDB();
    const { id } = req.params;
    db.announcements = db.announcements || [];
    const filtered = db.announcements.filter((a) => a.id !== id);

    if (filtered.length === db.announcements.length) {
      res.status(404).json({ error: "Announcement not found" });
      return;
    }

    db.announcements = filtered;
    writeDB(db);
    res.json({ message: "Announcement deleted" });
  });

  // --- CRUD: GALLERY ---
  app.post("/api/gallery", authenticateToken, (req, res) => {
    const db = readDB();
    const newGal = {
      id: "gal-" + Date.now(),
      title: req.body.title || "Gallery Image",
      category: req.body.category || "Other",
      imageUrl: req.body.imageUrl,
    };

    if (!newGal.imageUrl) {
      res.status(400).json({ error: "Image URL or data is required." });
      return;
    }

    db.gallery = db.gallery || [];
    db.gallery.push(newGal);
    writeDB(db);
    res.status(201).json({ message: "Gallery image added", item: newGal });
  });

  app.delete("/api/gallery/:id", authenticateToken, (req, res) => {
    const db = readDB();
    const { id } = req.params;
    db.gallery = db.gallery || [];
    const filtered = db.gallery.filter((g) => g.id !== id);

    if (filtered.length === db.gallery.length) {
      res.status(404).json({ error: "Image not found" });
      return;
    }

    db.gallery = filtered;
    writeDB(db);
    res.json({ message: "Gallery item removed" });
  });

  // --- CRUD: CONTACT MESSAGES ---
  app.post("/api/messages", (req, res) => {
    const db = readDB();
    const newMessage = {
      id: "msg-" + Date.now(),
      name: req.body.name,
      email: req.body.email || "",
      phone: req.body.phone,
      message: req.body.message,
      status: "unread" as const,
      date: new Date().toISOString().split("T")[0],
    };

    if (!newMessage.name || !newMessage.phone || !newMessage.message) {
      res.status(400).json({ error: "Name, phone, and message are required." });
      return;
    }

    db.messages = db.messages || [];
    db.messages.unshift(newMessage);
    writeDB(db);
    res.status(201).json({ message: "Message sent successfully", item: newMessage });
  });

  app.get("/api/messages", authenticateToken, (req, res) => {
    const db = readDB();
    res.json(db.messages || []);
  });

  app.put("/api/messages/:id", authenticateToken, (req, res) => {
    const db = readDB();
    const { id } = req.params;
    const { status } = req.body;

    db.messages = db.messages || [];
    const index = db.messages.findIndex((m) => m.id === id);

    if (index === -1) {
      res.status(404).json({ error: "Message not found" });
      return;
    }

    db.messages[index].status = status || "read";
    writeDB(db);
    res.json({ message: "Message status updated", item: db.messages[index] });
  });

  app.delete("/api/messages/:id", authenticateToken, (req, res) => {
    const db = readDB();
    const { id } = req.params;
    db.messages = db.messages || [];
    const filtered = db.messages.filter((m) => m.id !== id);

    if (filtered.length === db.messages.length) {
      res.status(404).json({ error: "Message not found" });
      return;
    }

    db.messages = filtered;
    writeDB(db);
    res.json({ message: "Message deleted" });
  });

  // --- VITE MIDDLEWARE CONFIGURATION ---
  if (process.env.NODE_ENV !== "production") {
    // Development Mode - load vite dynamically so production bundles don't require Vite
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use((vite as any).middlewares);
  } else {
    // Production Mode
    const distPath = path.join(process.cwd(), "dist");
    const indexFile = path.join(distPath, "index.html");
    if (fs.existsSync(distPath) && fs.existsSync(indexFile)) {
      app.use(express.static(distPath));
      app.get("/*", (req, res) => {
        res.sendFile(indexFile);
      });
    } else {
      // No frontend build present — run API-only. Provide a helpful root response.
      console.warn("No frontend build found at", distPath, ": running API-only mode.");
      app.get('/', (req, res) => {
        res.json({ status: 'ok', mode: 'api-only', message: 'Frontend not deployed on this service.' });
      });
    }
  }

  // Global error handler to catch unexpected errors and log request context
  // (helps diagnose 500s when called from browsers/other origins)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
    try {
      console.error("Unhandled server error:", err, {
        path: req.path,
        method: req.method,
        headers: req.headers,
        bodyPreview: req.body && typeof req.body === 'object' ? JSON.stringify(req.body).slice(0, 200) : String(req.body),
      });
    } catch (logErr) {
      console.error("Error while logging unhandled error", logErr);
    }
    res.status(500).json({ error: "Internal server error" });
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Vendra Panchayat Portal Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
