/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useLanguage } from "../components/LanguageContext";
import { SectionHeading, GlassCard } from "../components/UIComponents";
import { Phone, Search, Award, CheckCircle, ShieldCheck, Copy } from "lucide-react";
import { DatabaseSchema, WardMember, Official } from "../types";

export const Administration: React.FC<{ data: DatabaseSchema; onActionClick?: (msg: string) => void }> = ({
  data,
  onActionClick,
}) => {
  const { language, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");

  const copyToClipboard = (num: string) => {
    navigator.clipboard.writeText(num);
    if (onActionClick) {
      onActionClick(
        language === "te"
          ? `ఫోన్ నంబర్ ${num} క్లిప్‌బోర్డ్‌కు కాపీ చేయబడింది!`
          : `Contact number ${num} copied to clipboard!`
      );
    } else {
      alert(`Copied ${num}`);
    }
  };

  // Reads designation from DB and maps to translation key
  const getLocalizedDesignation = (designation: string) => {
    const d = designation.toLowerCase();
    if (d.includes("vice chairperson") || d.includes("vice chair")) return t("vice_chairperson");
    if (d.includes("chairperson") || d.includes("chairman"))        return t("chairperson");
    if (d.includes("vice sarpanch") || d.includes("vice"))          return t("vice_sarpanch");
    if (d.includes("secretary"))                                     return t("panchayat_secretary");
    if (d.includes("sarpanch"))                                      return t("sarpanch");
    if (d.includes("co-opted"))                                      return language === "te" ? "కో-ఆప్టెడ్ సభ్యుడు" : "Co-opted Member";
    return designation;
  };

  // Uses nameTe from DB — no hardcoding
  const getOfficialName = (off: Official) =>
    language === "te" && off.nameTe ? off.nameTe : off.name;

  const getWardMemberName = (member: WardMember) =>
    language === "te" && member.nameTe ? member.nameTe : member.name;

  // Ward display label — handles number and string (e.g. "Co-opted")
  const getWardLabel = (ward: number | string) => {
    if (typeof ward === "number") return `W-${ward.toString().padStart(2, "0")}`;
    return ward; // "Co-opted" or any string
  };

  const filteredWards = data.wardMembers.filter((member: WardMember) => {
    const name     = member.name.toLowerCase();
    const nameTe   = member.nameTe ?? "";
    const wardStr  = member.ward.toString();
    const term     = searchTerm.toLowerCase();
    return (
      name.includes(term) ||
      nameTe.includes(searchTerm) ||
      wardStr.includes(term)
    );
  });

  return (
    <div className="space-y-12">
      <SectionHeading
        badge={t("badge_officials")}
        title={t("admin_title")}
        subtitle={t("admin_subtitle")}
      />

      {/* Top Leadership Row */}
      {data.officials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.officials.map((off: Official) => (
            <GlassCard
              key={off.designation + off.name}
              className="relative overflow-hidden group border-t-4 border-gov-600 bg-slate-50/50"
            >
              <div className="absolute top-2 right-2 text-gov-600/10 dark:text-slate-700/20 group-hover:scale-110 transition duration-300">
                <Award className="w-20 h-20" />
              </div>

              <div className="space-y-4 relative z-10">
                <span className="px-2.5 py-1 bg-gov-150 text-gov-800 dark:bg-gov-950 dark:text-gov-300 rounded-md text-[10px] font-bold tracking-wider uppercase font-display border border-gov-200/20">
                  {getLocalizedDesignation(off.designation)}
                </span>

                <div>
                  <h3 className="text-lg font-display font-black text-slate-900 dark:text-white group-hover:text-gov-600 transition duration-200">
                    {getOfficialName(off)}
                  </h3>
                  {off.category && (
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-sans mt-0.5 uppercase tracking-wider">
                      {off.category}
                    </p>
                  )}
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-sans mt-1">
                    {language === "te"
                      ? `${data.nameTe || data.name} పంచాయతీ ప్రతినిధి`
                      : `${data.name} Panchayat Representative`}
                  </p>
                </div>

                {off.contact ? (
                  <div className="flex items-center gap-3 pt-2">
                    <a
                      href={`tel:${off.contact}`}
                      className="flex items-center gap-1 text-xs text-gov-700 dark:text-gov-400 font-bold hover:underline font-mono"
                    >
                      <Phone className="w-3.5 h-3.5 mr-1 text-gov-650" />
                      +91 {off.contact}
                    </a>
                    <button
                      onClick={() => copyToClipboard(off.contact!)}
                      className="p-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 transition duration-150 cursor-pointer"
                      title={language === "te" ? "కాపీ చేయండి" : "Copy number"}
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 dark:text-slate-600 pt-2 italic">
                    {language === "te" ? "సంప్రదింపు అందుబాటులో లేదు" : "Contact not available"}
                  </p>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <div className="py-10 text-center text-slate-400 text-sm">
          {language === "te" ? "అధికారుల సమాచారం అందుబాటులో లేదు." : "Officials information not available."}
        </div>
      )}

      {/* Ward Members Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-gov-600 shrink-0" />
            <h3 className="text-xl font-display font-bold text-slate-950 dark:text-white">
              {t("ward_members_title")}
            </h3>
          </div>

          {/* Search */}
          <div className="relative max-w-sm w-full shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={
                language === "te"
                  ? "వార్డు లేదా పేరుతో శోధించండి..."
                  : "Search by Ward or Member Name..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900/60 text-sm border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-gov-600 dark:text-white focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Members Grid */}
        {data.wardMembers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredWards.length > 0 ? (
              filteredWards.map((member: WardMember) => (
                <GlassCard
                  key={`${member.ward}-${member.name}`}
                  hoverEffect
                  className="flex flex-col justify-between p-5 bg-white/45"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="font-display font-black text-sm text-slate-400">
                        {getWardLabel(member.ward)}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 font-bold px-1.5 py-0.5 rounded border border-emerald-100/10">
                        <CheckCircle className="w-3 h-3" />
                        {language === "te" ? "క్రియాశీల సేవ" : "Active Office"}
                      </span>
                    </div>

                    <h4 className="text-sm font-display font-medium text-slate-900 dark:text-white leading-tight">
                      {getWardMemberName(member)}
                    </h4>

                    {member.category && (
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                        {member.category}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-3 mt-4 border-t border-slate-100 dark:border-slate-800/60">
                    {member.contact ? (
                      <>
                        <a
                          href={`tel:${member.contact}`}
                          className="flex items-center gap-1 text-xs text-slate-600 hover:text-gov-600 dark:text-slate-400 dark:hover:text-gov-400 font-medium transition font-mono"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          +91 {member.contact}
                        </a>
                        <button
                          onClick={() => copyToClipboard(member.contact!)}
                          className="p-1 px-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900 border border-transparent hover:border-slate-100 dark:hover:border-slate-800 transition text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                          title={language === "te" ? "నెంబర్ కాపీ చేయండి" : "Copy phone"}
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <p className="text-xs text-slate-400 italic">
                        {language === "te" ? "సంప్రదింపు లేదు" : "No contact"}
                      </p>
                    )}
                  </div>
                </GlassCard>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-slate-400 text-sm">
                {language === "te"
                  ? `"${searchTerm}" శోధన నివేదికలు లేవు`
                  : `No ward representative matches "${searchTerm}"`}
              </div>
            )}
          </div>
        ) : (
          <div className="py-10 text-center text-slate-400 text-sm">
            {language === "te" ? "వార్డు సభ్యుల సమాచారం అందుబాటులో లేదు." : "Ward member information not available."}
          </div>
        )}
      </div>
    </div>
  );
};
