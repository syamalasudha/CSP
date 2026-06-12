/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { GlassCard } from "../components/UIComponents";
import { useLanguage } from "../components/LanguageContext";
import {
  FileText, Download, X, CheckCircle2, ChevronRight,
  FileCheck, Users, ShieldCheck, AlertCircle
} from "lucide-react";

interface Certificate {
  id: string;
  name: string;
  description: string;
  documents: string[];
  steps: string[];
  downloadUrl: string | null;
  category: "identity" | "welfare" | "records";
}

interface Scheme {
  name: string;
  eligibility: string;
  category: string;
}

const CERTIFICATES: Certificate[] = [
  {
    id: "income",
    name: "Income Certificate",
    description: "Used for scholarships, fee reimbursement and welfare schemes.",
    documents: ["Aadhaar Card", "Ration Card", "Income Proof", "Passport Size Photo"],
    steps: [
      "Visit Village Secretariat / MeeSeva",
      "Fill application form",
      "Attach required documents",
      "Verification by authorities",
      "Certificate issued",
    ],
    downloadUrl: "https://drive.google.com/file/d/1p78217qG1fEsv-ODjriHM-r1u2j0apPn/view?usp=drive_link",
    category: "identity",
  },
  {
    id: "caste",
    name: "Caste Certificate",
    description: "Proof of caste category for reservations and government schemes.",
    documents: ["Aadhaar Card", "Ration Card", "School Record", "Community Proof"],
    steps: [
      "Submit application",
      "Attach supporting documents",
      "Field verification",
      "Approval by Tahsildar",
      "Certificate issued",
    ],
    downloadUrl: "https://drive.google.com/file/d/1KkqFcfadVVGfQ__7BdRytRG9pWiTI5L4/view?usp=drive_link",
    category: "identity",
  },
  {
    id: "birth",
    name: "Birth Certificate",
    description: "Official proof of birth registration.",
    documents: ["Hospital Record", "Parent Aadhaar", "Birth Report"],
    steps: ["Submit birth details", "Verification", "Registration", "Approval", "Certificate issued"],
    downloadUrl: "https://drive.google.com/file/d/1No9n9nfYKL8YWSs2OSlqqkKqBWcnCV0o/view?usp=drive_link",
    category: "records",
  },
  {
    id: "death",
    name: "Death Certificate",
    description: "Official proof of death registration.",
    documents: ["Death Report", "Hospital Certificate", "Applicant ID Proof"],
    steps: ["Submit application", "Verification", "Registration", "Approval", "Certificate issued"],
    downloadUrl: "https://drive.google.com/file/d/1q2haaixsxWzmnGBh0QNr2f4PxRv0wC9z/view?usp=drive_link",
    category: "records",
  },
  {
    id: "family",
    name: "Family Member Certificate",
    description: "Lists family members for legal and administrative purposes.",
    documents: ["Aadhaar Card", "Ration Card", "Family Details"],
    steps: ["Submit application", "Attach family details", "Verification", "Approval", "Certificate issued"],
    downloadUrl: "https://drive.google.com/file/d/1MujSftFhXpAW_NsoHBfY8-Kwd3ncFqdV/view?usp=drive_link",
    category: "identity",
  },
  {
    id: "ricecard",
    name: "Rice Card Services",
    description: "New Rice Card application, member addition/deletion, corrections and address changes.",
    documents: ["Aadhaar Card", "Passport Size Photo", "Mobile Number", "Address Proof"],
    steps: [
      "Visit Village Secretariat / MeeSeva",
      "Submit application",
      "Attach required documents",
      "Verification by authorities",
      "Rice Card service completed",
    ],
    downloadUrl: "https://drive.google.com/file/d/1XBHM5bNiLvsm_hnmaaDKJfcug0QB88aI/view?usp=sharing",
    category: "welfare",
  },
  {
    id: "aadhaar-update",
    name: "Aadhaar Update Service",
    description: "Apply for Aadhaar corrections — name, address, mobile number, date of birth and biometric updates.",
    documents: ["Existing Aadhaar Card", "Proof of Identity", "Proof of Address", "Mobile Number"],
    steps: [
      "Visit Aadhaar Update Center / MeeSeva",
      "Submit Aadhaar update request",
      "Attach supporting documents",
      "Biometric verification (if required)",
      "Updated Aadhaar generated",
    ],
    downloadUrl: "https://uidai.gov.in/images/Form_1_Eng.pdf",
    category: "identity",
  },
  {
    id: "ews",
    name: "EWS Certificate",
    description: "Economically Weaker Section certificate for education, employment and reservation benefits.",
    documents: ["Aadhaar Card", "Income Certificate", "Property Details", "Ration Card"],
    steps: [
      "Visit Village Secretariat / MeeSeva",
      "Submit application",
      "Attach required documents",
      "Verification by authorities",
      "Certificate issued",
    ],
    downloadUrl: "https://drive.google.com/file/d/1-rbLNFkAhN7CxNTlOlJEAuDVFPHe83r3/view?usp=sharing",
    category: "welfare",
  },
  {
    id: "obc",
    name: "OBC Certificate",
    description: "Certificate for Other Backward Class applicants for reservations and welfare schemes.",
    documents: ["Aadhaar Card", "Community Proof", "Ration Card", "Passport Size Photo"],
    steps: [
      "Visit Village Secretariat / MeeSeva",
      "Submit application",
      "Attach required documents",
      "Community verification",
      "Certificate issued",
    ],
    downloadUrl: "https://drive.google.com/file/d/1rUldANOwjtf2SJiTf3cSTjyV8Mkn5mG5/view?usp=drive_link",
    category: "identity",
  },
];

const SCHEMES: Scheme[] = [
  {
    name: "NTR Bharosa Pension Scheme",
    eligibility: "Senior citizens, widows, disabled persons, weavers, toddy tappers and other eligible beneficiaries.",
    category: "Pension",
  },
  {
    name: "Anna Canteens",
    eligibility: "Available for all citizens.",
    category: "Food",
  },
  {
    name: "Deepam Scheme",
    eligibility: "Eligible women and families.",
    category: "Welfare",
  },
  {
    name: "Farmer Welfare Schemes",
    eligibility: "Eligible farmers and agricultural workers.",
    category: "Agriculture",
  },
  {
    name: "Thalliki Vandanam",
    eligibility: "Mothers/guardians of eligible students studying in recognized schools as per government guidelines.",
    category: "Education",
  },
];

const categoryColors: Record<string, string> = {
  identity: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
  welfare: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
  records: "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300",
};

const categoryLabels: Record<string, string> = {
  identity: "Identity",
  welfare: "Welfare",
  records: "Records",
};

const schemeCategoryColors: Record<string, string> = {
  Pension: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  Food: "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300",
  Welfare: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
  Agriculture: "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300",
  Education: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
};

export const Certificates: React.FC = () => {
  const { language } = useLanguage();
  const [selected, setSelected] = useState<Certificate | null>(null);

  return (
    <div className="space-y-12">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gov-100 text-gov-800 dark:bg-gov-950/40 dark:text-gov-300 border border-gov-200/50 dark:border-gov-800/40 uppercase tracking-widest">
          <FileCheck className="w-3.5 h-3.5" />
          {language === "te" ? "పౌర సేవలు" : "Citizen Services"}
        </span>
        <h1 className="text-3xl md:text-4xl font-display font-black text-slate-900 dark:text-white tracking-tight">
          {language === "te" ? "సర్టిఫికేట్లు & పథకాలు" : "Certificates & Schemes"}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl mx-auto">
          {language === "te"
            ? "సర్టిఫికేట్ సమాచారం, అవసరమైన పత్రాలు మరియు దరఖాస్తు ప్రక్రియను యాక్సెస్ చేయండి."
            : "Access certificate information, required documents and application process at your village secretariat."}
        </p>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-800/40 rounded-xl p-4 text-sm text-blue-800 dark:text-blue-300">
        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
        <p>
          {language === "te"
            ? "ఏ సర్టిఫికేట్ కోసమైనా సమీపంలోని గ్రామ సచివాలయం లేదా MeeSeva కేంద్రాన్ని సందర్శించండి."
            : "For any certificate, visit your nearest Village Secretariat or MeeSeva centre. Bring original documents along with photocopies."}
        </p>
      </div>

      {/* Certificates Grid */}
      <section>
        <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <FileText className="w-5 h-5 text-gov-600" />
          {language === "te" ? "అందుబాటులో ఉన్న సర్టిఫికేట్లు" : "Available Certificates"}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CERTIFICATES.map((cert) => (
            <GlassCard key={cert.id} hoverEffect className="p-5 flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 bg-gov-50 dark:bg-gov-950/30 rounded-xl">
                  <FileText className="w-5 h-5 text-gov-600 dark:text-gov-400" />
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${categoryColors[cert.category]}`}>
                  {categoryLabels[cert.category]}
                </span>
              </div>

              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white mb-1">
                {cert.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed flex-1">
                {cert.description}
              </p>

              <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                <button
                  onClick={() => setSelected(cert)}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-gov-600 hover:bg-gov-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                  {language === "te" ? "వివరాలు" : "View Details"}
                </button>
                {cert.downloadUrl ? (
                  <a
                    href={cert.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {language === "te" ? "ఫారం" : "Form"}
                  </a>
                ) : (
                  <button
                    disabled
                    title="Form link will be added soon"
                    className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs font-semibold px-3 py-2 rounded-lg cursor-not-allowed"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {language === "te" ? "ఫారం" : "Form"}
                  </button>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Government Schemes */}
      <section>
        <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-gov-600" />
          {language === "te" ? "ప్రభుత్వ పథకాలు & అర్హత" : "Government Schemes & Eligibility"}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SCHEMES.map((scheme) => (
            <GlassCard key={scheme.name} hoverEffect className="p-5">
              <div className="flex items-start justify-between mb-3">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${schemeCategoryColors[scheme.category] || "bg-slate-100 text-slate-600"}`}>
                  {scheme.category}
                </span>
              </div>
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white mb-2">
                {scheme.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                <span className="font-semibold text-slate-600 dark:text-slate-300">
                  {language === "te" ? "అర్హత: " : "Eligibility: "}
                </span>
                {scheme.eligibility}
              </p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Certificate Detail Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && setSelected(null)}
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white rounded-2xl p-6 max-w-lg w-full shadow-2xl">
            {/* Modal header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gov-50 dark:bg-gov-950/30 rounded-xl">
                  <FileText className="w-5 h-5 text-gov-600" />
                </div>
                <div>
                  <h2 className="text-lg font-display font-bold">{selected.name}</h2>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${categoryColors[selected.category]}`}>
                    {categoryLabels[selected.category]}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
              {selected.description}
            </p>

            {/* Required Documents */}
            <div className="mb-5">
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                {language === "te" ? "అవసరమైన పత్రాలు" : "Required Documents"}
              </h3>
              <ul className="space-y-1.5">
                {selected.documents.map((doc) => (
                  <li key={doc} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-gov-500 shrink-0" />
                    {doc}
                  </li>
                ))}
              </ul>
            </div>

            {/* Application Steps */}
            <div className="mb-5">
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                {language === "te" ? "దరఖాస్తు ప్రక్రియ" : "Application Process"}
              </h3>
              <ol className="space-y-2">
                {selected.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gov-100 dark:bg-gov-950/40 text-gov-700 dark:text-gov-400 text-[11px] font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="text-slate-600 dark:text-slate-300 leading-snug pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              {selected.downloadUrl ? (
                <a
                  href={selected.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
                >
                  <Download className="w-4 h-4" />
                  {language === "te" ? "ఫారం డౌన్‌లోడ్" : "Download Form"}
                </a>
              ) : (
                <button
                  disabled
                  className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-400 text-sm font-semibold px-4 py-2 rounded-lg cursor-not-allowed"
                >
                  <Download className="w-4 h-4" />
                  {language === "te" ? "ఫారం త్వరలో" : "Form Coming Soon"}
                </button>
              )}
              <button
                onClick={() => setSelected(null)}
                className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold px-4 py-2 rounded-lg transition cursor-pointer"
              >
                {language === "te" ? "మూసివేయి" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
