/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import "dotenv/config";
import fs from "fs";
import path from "path";
import bcryptjs from "bcryptjs";
import { connectDB } from "./config/db";
import { Village } from "./models/Village";
import { Message } from "./models/Message";
import { User } from "./models/User";
import { CertificateItem, SchemeItem } from "./models/ServiceCatalog";

const DEFAULT_CERTIFICATES = [
  {
    id: "income",
    villageId: "all",
    name: "Income Certificate",
    nameTe: "ఆదాయ ధృవీకరణ పత్రం",
    description: "Used for scholarships, fee reimbursement, bank loans, and welfare schemes.",
    descriptionTe: "విద్యార్థి వేతనాలు, ఫీజు రీయింబర్స్‌మెంట్ మరియు సంక్షేమ పథకాల కోసం ఉపయోగపడుతుంది.",
    category: "identity",
    documents: ["Aadhaar Card", "Ration Card / Rice Card", "Income Proof / Salary or Land Details", "Passport Size Photo"],
    steps: [
      "Visit Village Secretariat (Sachivalayam) or MeeSeva",
      "Fill and submit the Income Certificate application form",
      "Attach Aadhaar, Rice Card, and self-declaration / income proof",
      "Field enquiry and verification by VRO / Tahsildar",
      "Digitally signed certificate issued (SMS alert sent)",
    ],
    processingTime: "7 - 15 Working Days",
    fee: "₹45 (MeeSeva / Sachivalayam)",
    officeLocation: "Village Secretariat / MeeSeva",
    downloadUrl: "https://drive.google.com/file/d/1p78217qG1fEsv-ODjriHM-r1u2j0apPn/view?usp=drive_link",
  },
  {
    id: "caste",
    villageId: "all",
    name: "Caste / Community Certificate",
    nameTe: "కుల ధృవీకరణ పత్రం",
    description: "Official proof of caste category for education reservations and government benefits.",
    descriptionTe: "విద్యా రిజర్వేషన్లు మరియు ప్రభుత్వ పథకాల కోసం కుల ధృవీకరణ పత్రం.",
    category: "identity",
    documents: ["Aadhaar Card", "Ration Card / Rice Card", "School Transfer / Study Certificate", "Parent / Relative Community Proof"],
    steps: [
      "Visit Village Secretariat / MeeSeva with original proofs",
      "Submit Caste Certificate application",
      "Attach school record and family community proof",
      "VRO & Revenue Inspector field verification, approved by Tahsildar",
      "Certificate issued digitally",
    ],
    processingTime: "15 - 30 Working Days",
    fee: "₹45 (MeeSeva / Sachivalayam)",
    officeLocation: "Village Secretariat / Tahsildar Office",
    downloadUrl: "https://drive.google.com/file/d/1KkqFcfadVVGfQ__7BdRytRG9pWiTI5L4/view?usp=drive_link",
  },
  {
    id: "birth",
    villageId: "all",
    name: "Birth Certificate",
    nameTe: "జనన ధృవీకరణ పత్రం",
    description: "Official proof of birth registration required for school admissions, passport, and Aadhaar.",
    descriptionTe: "పాఠశాల ప్రవేశాలు, పాస్‌పోర్ట్ మరియు ఆధార్ కోసం అధికారిక జనన నమోదు పత్రం.",
    category: "records",
    documents: ["Hospital Birth Discharge Record", "Parents' Aadhaar Cards", "Address Proof"],
    steps: [
      "Submit birth registration details at Village Secretariat / Panchayat Office",
      "Attach hospital birth slip and parents' Aadhaar copies",
      "Verification by Panchayat Secretary / Registrar",
      "Entry recorded in Civil Registration System (CRS)",
      "Birth Certificate issued",
    ],
    processingTime: "7 - 10 Working Days",
    fee: "Free within 21 days (nominal fee later)",
    officeLocation: "Gram Panchayat / Village Secretariat",
    downloadUrl: "https://drive.google.com/file/d/1No9n9nfYKL8YWSs2OSlqqkKqBWcnCV0o/view?usp=drive_link",
  },
  {
    id: "death",
    villageId: "all",
    name: "Death Certificate",
    nameTe: "మరణ ధృవీకరణ పత్రం",
    description: "Official proof of death registration for pension claims, insurance, and property succession.",
    descriptionTe: "పెన్షన్, బీమా మరియు ఆస్తి బదిలీల కోసం అధికారిక మరణ ధృవీకరణ పత్రం.",
    category: "records",
    documents: ["Hospital Death Summary / Medical Certificate", "Deceased Aadhaar Card", "Applicant ID Proof"],
    steps: [
      "Submit death registration application at Panchayat / Sachivalayam",
      "Attach hospital record or VRO certification",
      "Verification by Panchayat Secretary / Local Registrar",
      "Approval & registration in CRS portal",
      "Death Certificate issued",
    ],
    processingTime: "7 - 10 Working Days",
    fee: "Free within 21 days",
    officeLocation: "Gram Panchayat / Village Secretariat",
    downloadUrl: "https://drive.google.com/file/d/1q2haaixsxWzmnGBh0QNr2f4PxRv0wC9z/view?usp=drive_link",
  },
  {
    id: "family",
    villageId: "all",
    name: "Family Member Certificate",
    nameTe: "కుటుంబ సభ్యుల ధృవీకరణ పత్రం",
    description: "Lists legal family members for pension transfers, succession, and government claims.",
    descriptionTe: "వారసత్వం, పెన్షన్ మరియు ప్రభుత్వ క్లెయిమ్‌ల కోసం కుటుంబ సభ్యుల ధృవీకరణ పత్రం.",
    category: "identity",
    documents: ["Applicant Aadhaar Card", "Ration / Rice Card", "Death Certificate (if applicable)", "Self-Declaration & Family Details"],
    steps: [
      "Submit application at Village Secretariat / MeeSeva",
      "Attach family members' Aadhaar and Rice Card details",
      "VRO field enquiry & witness verification",
      "Approval by Tahsildar",
      "Family Member Certificate issued",
    ],
    processingTime: "15 Working Days",
    fee: "₹45 (MeeSeva / Sachivalayam)",
    officeLocation: "Village Secretariat / Tahsildar Office",
    downloadUrl: "https://drive.google.com/file/d/1MujSftFhXpAW_NsoHBfY8-Kwd3ncFqdV/view?usp=drive_link",
  },
  {
    id: "ricecard",
    villageId: "all",
    name: "Rice Card Services",
    nameTe: "రైస్ కార్డు సేవలు",
    description: "New Rice Card application, member addition/deletion, corrections, and address changes.",
    descriptionTe: "కొత్త రైస్ కార్డు దరఖాస్తు, సభ్యుల చేర్పు/తొలగింపు మరియు సవరణ సేవలు.",
    category: "welfare",
    documents: ["Aadhaar Cards of All Family Members", "Passport Size Photo", "Active Mobile Number", "Residence / Address Proof"],
    steps: [
      "Visit Village Secretariat with family Aadhaar cards",
      "Submit Rice Card service request via Digital Assistant / Welfare Assistant",
      "Biometric / e-KYC verification of members",
      "VRO & MRO approval",
      "Updated Rice Card issued",
    ],
    processingTime: "10 - 21 Working Days",
    fee: "Free / Nominal Service Charge",
    officeLocation: "Village Secretariat (Welfare Assistant)",
    downloadUrl: "https://drive.google.com/file/d/1XBHM5bNiLvsm_hnmaaDKJfcug0QB88aI/view?usp=sharing",
  },
  {
    id: "aadhaar-update",
    villageId: "all",
    name: "Aadhaar Update Service",
    nameTe: "ఆధార్ అప్‌డేట్ సేవ",
    description: "Apply for Aadhaar corrections — name, address, mobile number, date of birth, and biometric updates.",
    descriptionTe: "ఆధార్‌లో పేరు, చిరునామా, మొబైల్ నంబర్, పుట్టిన తేదీ మరియు బయోమెట్రిక్ సవరణలు.",
    category: "identity",
    documents: ["Existing Aadhaar Card", "Proof of Identity (PAN / Voter ID)", "Proof of Address (Ration Card / Electricity Bill)", "Active Mobile Number"],
    steps: [
      "Visit Village Secretariat Aadhaar Desk / MeeSeva / Aadhaar Seva Kendra",
      "Fill Aadhaar Update Form with correct details",
      "Provide original supporting documents for scan",
      "Complete biometric authentication",
      "Track URN receipt until updated Aadhaar is generated",
    ],
    processingTime: "7 - 15 Working Days",
    fee: "₹50 (Demographic) / ₹100 (Biometric)",
    officeLocation: "Village Secretariat / Aadhaar Kendra",
    downloadUrl: "https://uidai.gov.in/images/Form_1_Eng.pdf",
  },
  {
    id: "ews",
    villageId: "all",
    name: "EWS Certificate",
    nameTe: "ఈడబ్ల్యూఎస్ (EWS) ధృవీకరణ పత్రం",
    description: "Economically Weaker Section certificate for 10% reservation in education and employment.",
    descriptionTe: "విద్య మరియు ఉద్యోగాల్లో 10% ఆర్థిక వెనుకబాటు రిజర్వేషన్ కోసం EWS పత్రం.",
    category: "welfare",
    documents: ["Aadhaar Card", "Income Certificate", "Property / Land Details", "Ration / Rice Card"],
    steps: [
      "Visit Village Secretariat / MeeSeva",
      "Submit EWS application with income & asset declaration",
      "Attach Aadhaar, Income Certificate, and land records",
      "VRO & Tahsildar verification",
      "EWS Certificate issued",
    ],
    processingTime: "15 Working Days",
    fee: "₹45 (MeeSeva / Sachivalayam)",
    officeLocation: "Village Secretariat / Tahsildar Office",
    downloadUrl: "https://drive.google.com/file/d/1-rbLNFkAhN7CxNTlOlJEAuDVFPHe83r3/view?usp=sharing",
  },
  {
    id: "obc",
    villageId: "all",
    name: "OBC Certificate",
    nameTe: "ఓబీసీ (OBC) ధృవీకరణ పత్రం",
    description: "Central-format Other Backward Class certificate for central jobs and educational admissions.",
    descriptionTe: "కేంద్ర ప్రభుత్వ ఉద్యోగాలు మరియు విద్యా ప్రవేశాల కోసం OBC ధృవీకరణ పత్రం.",
    category: "identity",
    documents: ["Aadhaar Card", "State Caste / Community Proof", "Income Certificate (Non-Creamy Layer)", "Ration Card & Photo"],
    steps: [
      "Visit Village Secretariat / MeeSeva",
      "Submit OBC Non-Creamy Layer application",
      "Attach Caste & Income proofs",
      "Verification by VRO & Tahsildar",
      "OBC Certificate issued",
    ],
    processingTime: "15 - 30 Working Days",
    fee: "₹45 (MeeSeva / Sachivalayam)",
    officeLocation: "Village Secretariat / Tahsildar Office",
    downloadUrl: "https://drive.google.com/file/d/1rUldANOwjtf2SJiTf3cSTjyV8Mkn5mG5/view?usp=drive_link",
  },
];

const DEFAULT_SCHEMES = [
  {
    id: "ntr-bharosa-pension",
    villageId: "all",
    name: "NTR Bharosa Pension Scheme",
    nameTe: "ఎన్టీఆర్ భరోసా పెన్షన్ పథకం",
    category: "Pension",
    benefits: "Monthly social security pension delivered directly at doorstep on the 1st of every month.",
    benefitsTe: "ప్రతి నెల 1వ తేదీన ఇంటి వద్దకే నెలవారీ సామాజిక భద్రతా పెన్షన్ పంపిణీ.",
    eligibility: "Senior citizens (60+), widows, disabled persons, weavers, toddy tappers, single women, and eligible artisans.",
    eligibilityTe: "వృద్ధులు (60+), వితంతువులు, వికలాంగులు, గీత కార్మికులు, ఒంటరి మహిళలు మరియు అర్హులైన కళాకారులు.",
    documents: ["Aadhaar Card", "Rice Card / White Ration Card", "Age / Widow / SADAREM Disability Certificate", "Bank Passbook & Photo"],
    steps: [
      "Verify eligibility criteria with Ward Welfare Assistant at Village Secretariat",
      "Submit pension application along with Aadhaar & supporting certificate",
      "Field verification by Sachivalayam & MPDO approval",
      "Once sanctioned, receive monthly pension via biometric doorstep delivery",
    ],
    officialUrl: "https://ysrpensionkanuka.ap.gov.in/",
  },
  {
    id: "anna-canteens",
    villageId: "all",
    name: "Anna Canteens",
    nameTe: "అన్న క్యాంటీన్లు",
    category: "Food",
    benefits: "Subsidized nutritious breakfast, lunch, and dinner at ₹5 per meal.",
    benefitsTe: "కేవలం ₹5 కే పోషకమైన అల్పాహారం, మధ్యాహ్న భోజనం మరియు రాత్రి భోజనం.",
    eligibility: "Available for all citizens, daily wage workers, students, and travelers.",
    eligibilityTe: "అందరు పౌరులు, రోజువారీ కార్మికులు, విద్యార్థులు మరియు ప్రయాణికులకు అందుబాటులో ఉంటుంది.",
    documents: ["No mandatory documents required at point of service"],
    steps: [
      "Visit the nearest Anna Canteen counter during meal hours",
      "Collect meal token for ₹5",
      "Receive hygienic hot meal",
    ],
    officialUrl: null,
  },
  {
    id: "deepam-scheme",
    villageId: "all",
    name: "Deepam Scheme (Free LPG Cylinders)",
    nameTe: "దీపం పథకం (ఉచిత గ్యాస్ సిలిండర్లు)",
    category: "Welfare",
    benefits: "3 free LPG cylinder refills per year with DBT subsidy credited directly to beneficiary bank account.",
    benefitsTe: "సంవత్సరానికి 3 ఉచిత గ్యాస్ సిలిండర్లు (సబ్సిడీ నేరుగా బ్యాంకు ఖాతాలోకి జమ).",
    eligibility: "Eligible women and households holding active Rice Cards and domestic LPG connections.",
    eligibilityTe: "రైస్ కార్డు మరియు గృహ గ్యాస్ కనెక్షన్ ఉన్న అర్హులైన మహిళలు & కుటుంబాలు.",
    documents: ["Aadhaar Card", "Active Rice Card", "LPG Consumer Booklet / e-KYC", "Aadhaar-linked Bank Account"],
    steps: [
      "Complete LPG e-KYC with your gas agency or Village Secretariat",
      "Book cylinder refill normally via your LPG distributor",
      "Receive DBT subsidy directly into your Aadhaar-seeded bank account within 48 hours of delivery",
    ],
    officialUrl: null,
  },
  {
    id: "farmer-welfare",
    villageId: "all",
    name: "Farmer Welfare & Annadata Sukhibhava",
    nameTe: "రైతు సంక్షేమ పథకాలు (అన్నదాత సుఖీభవ)",
    category: "Agriculture",
    benefits: "Annual financial investment support, subsidized seeds, soil health testing, and crop insurance.",
    benefitsTe: "రైతులకు వార్షిక పెట్టుబడి సహాయం, రాయితీ విత్తనాలు, భూసార పరీక్షలు మరియు పంట బీమా.",
    eligibility: "Eligible land-owning farmers and registered tenant farmers (CCRC holders).",
    eligibilityTe: "భూమి ఉన్న రైతులు మరియు కౌలు రైతులు (CCRC కార్డుదారులు).",
    documents: ["Aadhaar Card", "Pattadar Passbook / 1B Adangal (or CCRC Card)", "Bank Passbook", "e-Crop Registration"],
    steps: [
      "Ensure land records & Aadhaar seeding are updated with VRO / Village Agricultural Assistant",
      "Complete e-Crop booking for each season at Rythu Seva Kendra",
      "Verify beneficiary status at Village Secretariat",
      "Receive investment support directly in Aadhaar-linked bank account",
    ],
    officialUrl: "https://apagri.ap.gov.in/",
  },
  {
    id: "thalliki-vandanam",
    villageId: "all",
    name: "Thalliki Vandanam",
    nameTe: "తల్లికి వందనం",
    category: "Education",
    benefits: "Annual financial assistance to mothers/guardians for supporting school-going children (Classes 1 to 12).",
    benefitsTe: "1 నుండి 12వ తరగతి చదివే విద్యార్థుల తల్లులకు/సంరక్షకులకు వార్షిక ఆర్థిక సహాయం.",
    eligibility: "Mothers/guardians of eligible students studying in recognized schools with required attendance as per govt norms.",
    eligibilityTe: "గుర్తింపు పొందిన పాఠశాలల్లో చదువుతున్న అర్హులైన విద్యార్థుల తల్లులు/సంరక్షకులు.",
    documents: ["Mother & Student Aadhaar Cards", "School Enrollment / Attendance Record", "Rice Card", "Mother's Bank Account (NPCI Linked)"],
    steps: [
      "Ensure student enrollment & attendance are updated in the school UDISE / child info portal",
      "Complete mother's biometric/e-KYC and bank NPCI mapping at Village Secretariat",
      "Verify eligibility list displayed at Sachivalayam",
      "Financial assistance credited directly to mother's bank account",
    ],
    officialUrl: "https://vsws.ap.gov.in/",
  },
];

function findSeedFile(): string | null {
  const candidates = [
    path.join(process.cwd(), "db.json"),
    path.join(process.cwd(), "backend", "db.json"),
    path.resolve(process.cwd(), "..", "db.json"),
  ];
  if (typeof __dirname !== "undefined") {
    candidates.push(
      path.resolve(__dirname, "db.json"),
      path.resolve(__dirname, "..", "db.json")
    );
  }
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

/**
 * Seeds MongoDB villages, base admin/citizen accounts, certificates, and schemes.
 * When force=false, each collection is seeded independently if empty.
 */
export async function seedDatabase(force = false): Promise<void> {
  // 1. Villages + initial messages
  const existingVillages = await Village.countDocuments();
  if (force || existingVillages === 0) {
    const seedFile = findSeedFile();
    if (seedFile) {
      const raw = JSON.parse(fs.readFileSync(seedFile, "utf8"));
      const villages: any[] = Array.isArray(raw?.villages) ? raw.villages : [];
      for (const v of villages) {
        const { messages = [], ...villagePayload } = v;
        await Village.findOneAndUpdate(
          { id: v.id },
          { $set: villagePayload },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        if (Array.isArray(messages) && messages.length > 0) {
          for (const msg of messages) {
            if (!msg?.id) continue;
            await Message.findOneAndUpdate(
              { id: msg.id },
              { $setOnInsert: { ...msg, villageId: v.id } },
              { upsert: true }
            );
          }
        }
      }
      console.log(`[Seed] Synced ${villages.length} villages into MongoDB from ${path.basename(seedFile)}.`);
    } else {
      console.warn("[Seed] No db.json seed file found; skipping village seed.");
    }
  }

  // 2. Base Admin & Citizen Logins
  const existingUsers = await User.countDocuments();
  if (force || existingUsers === 0) {
    const adminPasswordHash =
      process.env.ADMIN_PASSWORD_HASH || "$2b$10$rI75Oi7p.NPtLg2/mLos5eTv1CpMQjMc34MIAnUNOeo.1DdZy3CDi"; // password123
    const citizenPasswordHash = bcryptjs.hashSync("citizen123", 10);

    await User.findOneAndUpdate(
      { username: (process.env.ADMIN_USERNAME || "admin").toLowerCase() },
      {
        $setOnInsert: {
          username: (process.env.ADMIN_USERNAME || "admin").toLowerCase(),
          passwordHash: adminPasswordHash,
          role: "admin",
          fullName: "Panchayat Administrator",
          phone: "9573930799",
          email: "admin.panchayat@ap.gov.in",
          villageId: "vendra",
          ward: "Office",
        },
      },
      { upsert: true }
    );

    await User.findOneAndUpdate(
      { username: "citizen" },
      {
        $setOnInsert: {
          username: "citizen",
          passwordHash: citizenPasswordHash,
          role: "citizen",
          fullName: "Village Citizen (Demo)",
          phone: "9876543210",
          email: "citizen@example.com",
          villageId: "vendra",
          ward: "1",
        },
      },
      { upsert: true }
    );
    console.log("[Seed] Ensured base admin (admin/password123) and citizen (citizen/citizen123) accounts.");
  }

  // 3. Certificates / Document Guides
  const existingCerts = await CertificateItem.countDocuments();
  if (force || existingCerts === 0) {
    for (const cert of DEFAULT_CERTIFICATES) {
      await CertificateItem.findOneAndUpdate(
        { id: cert.id },
        { $setOnInsert: cert },
        { upsert: true }
      );
    }
    console.log(`[Seed] Synced ${DEFAULT_CERTIFICATES.length} certificate guides into MongoDB.`);
  }

  // 4. Government Welfare Schemes
  const existingSchemes = await SchemeItem.countDocuments();
  if (force || existingSchemes === 0) {
    for (const scheme of DEFAULT_SCHEMES) {
      await SchemeItem.findOneAndUpdate(
        { id: scheme.id },
        { $setOnInsert: scheme },
        { upsert: true }
      );
    }
    console.log(`[Seed] Synced ${DEFAULT_SCHEMES.length} government schemes into MongoDB.`);
  }
}

// Allow running directly via `npm run seed`
const isDirectRun =
  typeof process !== "undefined" &&
  Array.isArray(process.argv) &&
  process.argv[1]?.includes("seed");

if (isDirectRun) {
  (async () => {
    try {
      await connectDB();
      await seedDatabase(true);
      process.exit(0);
    } catch (err) {
      console.error("[Seed] Failed to seed MongoDB:", err);
      process.exit(1);
    }
  })();
}
