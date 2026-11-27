/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { GlassCard } from "../components/UIComponents";
import { useLanguage } from "../components/LanguageContext";
import { apiUrl } from "../config/api";
import { CertificateItem, SchemeItem } from "../types";
import {
  FileText,
  Download,
  X,
  CheckCircle2,
  ChevronRight,
  FileCheck,
  ShieldCheck,
  AlertCircle,
  Search,
  Clock,
  IndianRupee,
  MapPin,
  Bookmark,
  ExternalLink,
  Loader2,
} from "lucide-react";

interface CertificatesProps {
  villageId: string;
  savedCertificates?: string[];
  savedSchemes?: string[];
  onToggleBookmark?: (type: "certificate" | "scheme", itemId: string) => void;
}

const categoryColors: Record<string, string> = {
  identity: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
  welfare: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
  records: "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300",
  revenue: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
};

const categoryLabels: Record<string, { en: string; te: string }> = {
  all: { en: "All", te: "అన్నీ" },
  identity: { en: "Identity", te: "గుర్తింపు" },
  welfare: { en: "Welfare", te: "సంక్షేమం" },
  records: { en: "Records", te: "రికార్డులు" },
  revenue: { en: "Revenue", te: "రెవెన్యూ" },
};

const schemeCategoryColors: Record<string, string> = {
  Pension: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  Food: "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300",
  Welfare: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
  Agriculture: "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300",
  Education: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
  Housing: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300",
};

export const Certificates: React.FC<CertificatesProps> = ({
  villageId,
  savedCertificates = [],
  savedSchemes = [],
  onToggleBookmark,
}) => {
  const { language } = useLanguage();
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [schemes, setSchemes] = useState<SchemeItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [certCategory, setCertCategory] = useState<string>("all");
  const [schemeCategory, setSchemeCategory] = useState<string>("All");
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);
  const [selectedScheme, setSelectedScheme] = useState<SchemeItem | null>(null);

  useEffect(() => {
    let active = true;
    const loadServices = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(apiUrl(`/api/services?villageId=${encodeURIComponent(villageId)}`));
        if (!res.ok) throw new Error("Failed to load citizen services");
        const json = await res.json();
        if (active) {
          setCertificates(json.certificates || []);
          setSchemes(json.schemes || []);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Could not load services catalog");
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    loadServices();
    return () => {
      active = false;
    };
  }, [villageId]);

  const query = searchTerm.trim().toLowerCase();

  const filteredCertificates = certificates.filter((cert) => {
    const matchesCat = certCategory === "all" || cert.category === certCategory;
    if (!matchesCat) return false;
    if (!query) return true;
    return (
      cert.name.toLowerCase().includes(query) ||
      (cert.nameTe || "").toLowerCase().includes(query) ||
      cert.description.toLowerCase().includes(query) ||
      (cert.descriptionTe || "").toLowerCase().includes(query) ||
      cert.documents.some((d) => d.toLowerCase().includes(query))
    );
  });

  const schemeCategories = ["All", ...Array.from(new Set(schemes.map((s) => s.category).filter(Boolean)))];

  const filteredSchemes = schemes.filter((scheme) => {
    const matchesCat = schemeCategory === "All" || scheme.category === schemeCategory;
    if (!matchesCat) return false;
    if (!query) return true;
    return (
      scheme.name.toLowerCase().includes(query) ||
      (scheme.nameTe || "").toLowerCase().includes(query) ||
      scheme.eligibility.toLowerCase().includes(query) ||
      (scheme.benefits || "").toLowerCase().includes(query) ||
      (scheme.documents || []).some((d) => d.toLowerCase().includes(query))
    );
  });

  return (
    <div className="space-y-12">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gov-100 text-gov-800 dark:bg-gov-950/40 dark:text-gov-300 border border-gov-200/50 dark:border-gov-800/40 uppercase tracking-widest">
          <FileCheck className="w-3.5 h-3.5" />
          {language === "te" ? "పౌర సేవలు" : "Citizen Services"}
        </span>
        <h1 className="text-3xl md:text-4xl font-display font-black text-slate-900 dark:text-white tracking-tight">
          {language === "te" ? "సర్టిఫికేట్లు, పత్రాలు & ప్రభుత్వ పథకాలు" : "Certificates, Documents & Govt Schemes"}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-2xl mx-auto">
          {language === "te"
            ? "సచివాలయం లేదా మీసేవకు వెళ్లే ముందే అవసరమైన పత్రాలు, అర్హత, ఫీజు మరియు దరఖాస్తు ప్రక్రియను ఇక్కడ పూర్తిగా తెలుసుకోండి."
            : "Check required documents, eligibility, processing time, fees, and step-by-step application guides online before visiting the Village Secretariat or MeeSeva."}
        </p>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-800/40 rounded-xl p-4 text-sm text-blue-800 dark:text-blue-300">
        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
        <p>
          {language === "te"
            ? "సచివాలయానికి వెళ్లే ముందు ఈ జాబితాలోని అన్ని అసలు పత్రాలు మరియు జిరాక్స్ కాపీలను సిద్ధంగా ఉంచుకోండి. సేవ్ బటన్‌తో మీ చెక్‌లిస్ట్‌లో భద్రపరుచుకోవచ్చు."
            : "Prepare original documents and photocopies listed inside each service guide before visiting your Village Secretariat or MeeSeva centre. Use Save to add items to your Citizen Checklist."}
        </p>
      </div>

      {/* Global Search */}
      <div className="relative max-w-xl mx-auto">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={
            language === "te"
              ? "సర్టిఫికేట్, పథకం లేదా పత్రం పేరుతో వెతకండి (ఉదా: Income, Pension, Aadhaar)..."
              : "Search by certificate, scheme, or document (e.g. Income, Pension, Ration)..."
          }
          className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-gov-600/40 shadow-sm"
        />
      </div>

      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-400">
          <Loader2 className="w-7 h-7 animate-spin text-gov-600" />
          <p className="text-sm">{language === "te" ? "సేవల సమాచారం లోడ్ అవుతోంది..." : "Loading live services & schemes..."}</p>
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 text-center text-sm text-rose-700 dark:text-rose-300">
          {error}
        </div>
      ) : (
        <>
          {/* Certificates Grid */}
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-gov-600" />
                {language === "te" ? "అందుబాటులో ఉన్న సర్టిఫికేట్లు & పత్రాలు" : "Available Certificates & Documents"}
                <span className="text-xs font-mono text-slate-400">({filteredCertificates.length})</span>
              </h2>

              <div className="flex flex-wrap gap-2">
                {(["all", "identity", "welfare", "records", "revenue"] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCertCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition cursor-pointer ${
                      certCategory === cat
                        ? "bg-gov-600 text-white border-transparent"
                        : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50"
                    }`}
                  >
                    {language === "te" ? categoryLabels[cat].te : categoryLabels[cat].en}
                  </button>
                ))}
              </div>
            </div>

            {filteredCertificates.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">
                {language === "te" ? "మీ వెతుకులాటకు సరిపోయే సర్టిఫికేట్లు లభించలేదు." : "No matching certificates found."}
              </p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredCertificates.map((cert) => {
                  const isSaved = savedCertificates.includes(cert.id);
                  return (
                    <GlassCard key={cert.id} hoverEffect className="p-5 flex flex-col">
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-2.5 bg-gov-50 dark:bg-gov-950/30 rounded-xl">
                          <FileText className="w-5 h-5 text-gov-600 dark:text-gov-400" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${categoryColors[cert.category] || categoryColors.identity}`}>
                            {language === "te"
                              ? categoryLabels[cert.category]?.te || cert.category
                              : categoryLabels[cert.category]?.en || cert.category}
                          </span>
                          {onToggleBookmark && (
                            <button
                              onClick={() => onToggleBookmark("certificate", cert.id)}
                              title={isSaved ? "Remove from checklist" : "Save to checklist"}
                              className={`p-1.5 rounded-lg border transition cursor-pointer ${
                                isSaved
                                  ? "bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-amber-600"
                                  : "border-slate-200 dark:border-slate-800 text-slate-400 hover:text-gov-600"
                              }`}
                            >
                              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
                            </button>
                          )}
                        </div>
                      </div>

                      <h3 className="font-display font-bold text-base text-slate-900 dark:text-white mb-1">
                        {language === "te" && cert.nameTe ? cert.nameTe : cert.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed flex-1">
                        {language === "te" && cert.descriptionTe ? cert.descriptionTe : cert.description}
                      </p>

                      {cert.processingTime && (
                        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                          <Clock className="w-3.5 h-3.5 text-gov-600 shrink-0" />
                          <span>{cert.processingTime}</span>
                        </div>
                      )}

                      <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                        <button
                          onClick={() => setSelectedCert(cert)}
                          className="flex-1 flex items-center justify-center gap-1.5 bg-gov-600 hover:bg-gov-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition cursor-pointer"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                          {language === "te" ? "పత్రాలు & ప్రక్రియ" : "Documents & Steps"}
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
                  );
                })}
              </div>
            )}
          </section>

          {/* Government Schemes */}
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-gov-600" />
                {language === "te" ? "ప్రభుత్వ పథకాలు, అర్హత & దరఖాస్తు విధానం" : "Government Schemes, Eligibility & Application Guide"}
                <span className="text-xs font-mono text-slate-400">({filteredSchemes.length})</span>
              </h2>

              <div className="flex flex-wrap gap-2">
                {schemeCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSchemeCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition cursor-pointer ${
                      schemeCategory === cat
                        ? "bg-gov-600 text-white border-transparent"
                        : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {filteredSchemes.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">
                {language === "te" ? "మీ వెతుకులాటకు సరిపోయే పథకాలు లభించలేదు." : "No matching government schemes found."}
              </p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredSchemes.map((scheme) => {
                  const isSaved = savedSchemes.includes(scheme.id);
                  return (
                    <GlassCard key={scheme.id} hoverEffect className="p-5 flex flex-col">
                      <div className="flex items-start justify-between mb-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            schemeCategoryColors[scheme.category] || "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                          }`}
                        >
                          {scheme.category}
                        </span>
                        {onToggleBookmark && (
                          <button
                            onClick={() => onToggleBookmark("scheme", scheme.id)}
                            title={isSaved ? "Remove from checklist" : "Save to checklist"}
                            className={`p-1.5 rounded-lg border transition cursor-pointer ${
                              isSaved
                                ? "bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-amber-600"
                                : "border-slate-200 dark:border-slate-800 text-slate-400 hover:text-gov-600"
                            }`}
                          >
                            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
                          </button>
                        )}
                      </div>

                      <h3 className="font-display font-bold text-base text-slate-900 dark:text-white mb-2">
                        {language === "te" && scheme.nameTe ? scheme.nameTe : scheme.name}
                      </h3>
                      {(scheme.benefits || scheme.benefitsTe) && (
                        <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium mb-2 leading-relaxed">
                          {language === "te" && scheme.benefitsTe ? scheme.benefitsTe : scheme.benefits}
                        </p>
                      )}
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed flex-1">
                        <span className="font-semibold text-slate-600 dark:text-slate-300">
                          {language === "te" ? "అర్హత: " : "Eligibility: "}
                        </span>
                        {language === "te" && scheme.eligibilityTe ? scheme.eligibilityTe : scheme.eligibility}
                      </p>

                      <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                        <button
                          onClick={() => setSelectedScheme(scheme)}
                          className="flex-1 flex items-center justify-center gap-1.5 bg-gov-600 hover:bg-gov-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition cursor-pointer"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                          {language === "te" ? "అవసరమైన పత్రాలు & దరఖాస్తు" : "How to Apply & Docs"}
                        </button>
                        {scheme.officialUrl && (
                          <a
                            href={scheme.officialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold px-3 py-2 rounded-lg transition"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            {language === "te" ? "పోర్టల్" : "Portal"}
                          </a>
                        )}
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}

      {/* Certificate Detail Modal */}
      {selectedCert && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && setSelectedCert(null)}
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gov-50 dark:bg-gov-950/30 rounded-xl">
                  <FileText className="w-5 h-5 text-gov-600" />
                </div>
                <div>
                  <h2 className="text-lg font-display font-bold">
                    {language === "te" && selectedCert.nameTe ? selectedCert.nameTe : selectedCert.name}
                  </h2>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${categoryColors[selectedCert.category] || categoryColors.identity}`}>
                    {language === "te"
                      ? categoryLabels[selectedCert.category]?.te || selectedCert.category
                      : categoryLabels[selectedCert.category]?.en || selectedCert.category}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCert(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
              {language === "te" && selectedCert.descriptionTe ? selectedCert.descriptionTe : selectedCert.description}
            </p>

            {/* Meta badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-5 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {language === "te" ? "సమయం" : "Timeline"}
                </span>
                <p className="font-semibold mt-0.5">{selectedCert.processingTime || "7-15 Days"}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                  <IndianRupee className="w-3 h-3" /> {language === "te" ? "ఫీజు" : "Fee"}
                </span>
                <p className="font-semibold mt-0.5">{selectedCert.fee || "Nominal"}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {language === "te" ? "కేంద్రం" : "Office"}
                </span>
                <p className="font-semibold mt-0.5">{selectedCert.officeLocation || "Sachivalayam"}</p>
              </div>
            </div>

            {/* Required Documents */}
            <div className="mb-5">
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                {language === "te" ? "అవసరమైన పత్రాలు" : "Required Documents"}
              </h3>
              <ul className="space-y-1.5">
                {selectedCert.documents.map((doc) => (
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
                {selectedCert.steps.map((step, i) => (
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
              {selectedCert.downloadUrl ? (
                <a
                  href={selectedCert.downloadUrl}
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
                onClick={() => setSelectedCert(null)}
                className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold px-4 py-2 rounded-lg transition cursor-pointer"
              >
                {language === "te" ? "మూసివేయి" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scheme Detail Modal */}
      {selectedScheme && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && setSelectedScheme(null)}
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${schemeCategoryColors[selectedScheme.category] || "bg-slate-100 text-slate-600"}`}>
                  {selectedScheme.category}
                </span>
                <h2 className="text-lg font-display font-bold mt-2">
                  {language === "te" && selectedScheme.nameTe ? selectedScheme.nameTe : selectedScheme.name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedScheme(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {(selectedScheme.benefits || selectedScheme.benefitsTe) && (
              <div className="mb-4 p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/40">
                <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 block mb-1">
                  {language === "te" ? "పథకం ప్రయోజనాలు" : "Scheme Benefits"}
                </span>
                <p className="text-sm text-emerald-900 dark:text-emerald-200">
                  {language === "te" && selectedScheme.benefitsTe ? selectedScheme.benefitsTe : selectedScheme.benefits}
                </p>
              </div>
            )}

            <div className="mb-5">
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                {language === "te" ? "అర్హత నిబంధనలు" : "Eligibility"}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {language === "te" && selectedScheme.eligibilityTe ? selectedScheme.eligibilityTe : selectedScheme.eligibility}
              </p>
            </div>

            {selectedScheme.documents && selectedScheme.documents.length > 0 && (
              <div className="mb-5">
                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
                  {language === "te" ? "అవసరమైన పత్రాలు" : "Required Documents"}
                </h3>
                <ul className="space-y-1.5">
                  {selectedScheme.documents.map((doc) => (
                    <li key={doc} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 text-gov-500 shrink-0" />
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedScheme.steps && selectedScheme.steps.length > 0 && (
              <div className="mb-5">
                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
                  {language === "te" ? "దరఖాస్తు విధానం" : "How to Apply"}
                </h3>
                <ol className="space-y-2">
                  {selectedScheme.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gov-100 dark:bg-gov-950/40 text-gov-700 dark:text-gov-400 text-[11px] font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span className="text-slate-600 dark:text-slate-300 leading-snug pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              {selectedScheme.officialUrl && (
                <a
                  href={selectedScheme.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
                >
                  <ExternalLink className="w-4 h-4" />
                  {language === "te" ? "అధికారిక వెబ్‌సైట్" : "Official Portal"}
                </a>
              )}
              <button
                onClick={() => setSelectedScheme(null)}
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
