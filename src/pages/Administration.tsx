/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useLanguage } from "../components/LanguageContext";
import { SectionHeading, GlassCard } from "../components/UIComponents";
import { Phone, Search, Award, CheckCircle, ShieldCheck, Mail, Copy } from "lucide-react";
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
      onActionClick(language === "te" ? `ఫోన్ నంబర్ ${num} క్లిప్‌బోర్డ్‌కు కాపీ చేయబడింది!` : `Contact number ${num} copied to clipboard!`);
    } else {
      alert(`Copied ${num}`);
    }
  };

  const getLocalizedDesignation = (designation: string) => {
    const dLower = designation.toLowerCase();
    if (dLower.includes("vice")) return t("vice_sarpanch");
    if (dLower.includes("secretary")) return t("panchayat_secretary");
    if (dLower.includes("sarpanch")) return t("sarpanch");
    return designation;
  };

  const getLocalizedOfficialName = (name: string) => {
    if (name.includes("Srinivas") && !name.includes("Achanta")) return t("role_sarpanch");
    if (name.includes("Trimurthulu")) return t("role_vice_sarpanch");
    if (name.includes("Veera Swamy") || name.includes("S. Veera")) return t("role_panchayat_secretary");
    return name;
  };

  // Safe ward member lookup for matching Telugu names
  const getLocalizedWardMemberName = (ward: number, defaultName: string) => {
    if (language !== "te") return defaultName;
    const teluguWardMembers: { [key: number]: string } = {
      1: "మండపల్లి శామ్యూల్",
      2: "దార ప్రశాంతి కుమారి",
      3: "నార్ల వీర వెంకట సత్యనారాయణమ్మ",
      4: "కోసూరి సతీష్",
      5: "పట్నిది సూర్యకుమారి",
      6: "ఆచంట శ్రీనివాసు",
      7: "పేపకాయల సూర్యనారాయణ",
      8: "నార్ల వీర వెంకట సత్యనారాయణ",
      9: "నార్ల సత్యవాణి",
      10: "ఓదూరి లక్ష్మి",
      11: "కోసూరి శ్రీనివాస్",
      12: "కొండేపూడి కనకదుర్గ"
    };
    return teluguWardMembers[ward] || defaultName;
  };

  const filteredWards = data.wardMembers.filter(
    (member: WardMember) => {
      const teluguName = getLocalizedWardMemberName(member.ward, member.name);
      return member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teluguName.includes(searchTerm) ||
        member.ward.toString().includes(searchTerm);
    }
  );

  return (
    <div className="space-y-12">
      <SectionHeading
        badge={t("badge_officials")}
        title={t("admin_title")}
        subtitle={t("admin_subtitle")}
      />

      {/* Top Leadership Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {data.officials.map((off: Official) => (
          <GlassCard key={off.designation} className="relative overflow-hidden group border-t-4 border-gov-600 bg-slate-50/50">
            <div className="absolute top-2 right-2 text-gov-600/10 dark:text-slate-700/20 group-hover:scale-110 transition duration-300">
              <Award className="w-20 h-20" />
            </div>

            <div className="space-y-4 relative z-10">
              <span className="px-2.5 py-1 bg-gov-150 text-gov-800 dark:bg-gov-950 dark:text-gov-300 rounded-md text-[10px] font-bold tracking-wider uppercase font-display border border-gov-200/20">
                {getLocalizedDesignation(off.designation)}
              </span>

              <div>
                <h3 className="text-lg font-display font-black text-slate-900 dark:text-white group-hover:text-gov-600 transition duration-200">
                  {getLocalizedOfficialName(off.name)}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-sans mt-0.5">
                  {language === "te" ? "వేండ్ర గ్రామ పంచాయతీ ప్రతినిధి" : "Vendra Gram Panchayat Representative"}
                </p>
              </div>

              {off.contact && (
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
                    className="p-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 group transition duration-150 cursor-pointer"
                    title={language === "te" ? "కాపీ చేయండి" : "Copy Description"}
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Detailed Ward Members list search and grid */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-gov-600 shrink-0" />
            <h3 className="text-xl font-display font-bold text-slate-950 dark:text-white">
              {t("ward_members_title")}
            </h3>
          </div>

          {/* Quick Search box */}
          <div className="relative max-w-sm w-full shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={language === "te" ? "వార్డు లేదా పేరుతో శోధించండి..." : "Search by Ward or Member Name..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900/60 text-sm border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-gov-600 dark:text-white focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Members Grid list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredWards.length > 0 ? (
            filteredWards.map((member: WardMember) => (
              <GlassCard
                key={member.ward}
                hoverEffect
                className="flex flex-col justify-between p-5 bg-white/45"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="font-display font-black text-sm text-slate-400">
                      W-{member.ward.toString().padStart(2, "0")}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 font-bold px-1.5 py-0.5 rounded border border-emerald-100/10">
                      <CheckCircle className="w-3 h-3" />
                      {language === "te" ? "క్రియాశీల సేవ" : "Active Office"}
                    </span>
                  </div>

                  <h4 className="text-sm font-display font-medium text-slate-900 dark:text-white leading-tight">
                    {getLocalizedWardMemberName(member.ward, member.name)}
                  </h4>
                </div>

                <div className="flex justify-between items-center pt-3 mt-4 border-t border-slate-100 dark:border-slate-800/60">
                  <a
                    href={`tel:${member.contact}`}
                    className="flex items-center gap-1 text-xs text-slate-600 hover:text-gov-600 dark:text-slate-400 dark:hover:text-gov-400 font-medium transition font-mono"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    +91 {member.contact}
                  </a>
                  <button
                    onClick={() => copyToClipboard(member.contact)}
                    className="p-1 px-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900 border border-transparent hover:border-slate-100 dark:hover:border-slate-800 transition text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                    title={language === "te" ? "నెంబర్ కాపీ చేయండి" : "Copy phone"}
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </GlassCard>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-slate-400 text-sm">
              {language === "te" ? `"${searchTerm}" శోధన నివేదికలు లేవు` : `No ward representative matches "${searchTerm}"`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
