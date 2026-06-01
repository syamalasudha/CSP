/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useLanguage } from "../components/LanguageContext";
import { SectionHeading, GlassCard } from "../components/UIComponents";
import { Search, Phone, Copy, Heart, User, Sparkles } from "lucide-react";
import { DatabaseSchema, StaffMember } from "../types";

export const Directory: React.FC<{ data: DatabaseSchema; onActionClick?: (msg: string) => void }> = ({
  data,
  onActionClick,
}) => {
  const { language, t } = useLanguage();
  const [activeDept, setActiveDept] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");

  const copyToClipboard = (num: string) => {
    navigator.clipboard.writeText(num);
    if (onActionClick) {
      onActionClick(language === "te" ? `ఫోన్ నంబర్ +91 ${num} కాపీ చేయబడింది!` : `Contact number +91 ${num} copied successfully!`);
    } else {
      alert(`Copied number: ${num}`);
    }
  };

  const departments = ["All", "Sachivalayam", "Anganwadi", "VOA"];

  const getLocalizedDeptName = (dept: string) => {
    switch (dept) {
      case "All": return language === "te" ? "అన్ని విభాగాలు" : "All Departments";
      case "Sachivalayam": return t("group_sachivalayam");
      case "Anganwadi": return t("group_anganwadi");
      case "VOA": return t("group_voa");
      default: return dept;
    }
  };

  const getLocalizedRole = (role: string) => {
    if (language !== "te") return role;
    const lowerRole = role.toLowerCase();
    if (lowerRole.includes("ps gr-4") || lowerRole.includes("panchayat secretary")) return "పంచాయతీ సహాయ కార్యదర్శి (PS GR-4)";
    if (lowerRole.includes("vro")) return "విలేజ్ రెవెన్యూ అధికారి (VRO)";
    if (lowerRole.includes("digital assistant")) return "డిజిటల్ అసిస్టెంట్";
    if (lowerRole.includes("welfare and education")) return "సంక్షేమ మరియు విద్యా సహాయకుడు";
    if (lowerRole.includes("engineering")) return "ఇంజనీరింగ్ సహాయకుడు";
    if (lowerRole.includes("mahila police")) return "మహిళా పోలీస్ (మహిళా రక్షణ)";
    if (lowerRole.includes("surveyor")) return "గ్రామ సర్వేయర్";
    if (lowerRole.includes("agricultural assistant")) return "వ్యవసాయ సహాయకుడు";
    if (lowerRole.includes("veterinary")) return "పశువైద్య సహాయకుడు";
    if (lowerRole.includes("energy")) return "విద్యుత్ సహాయకుడు (లైన్మెన్)";
    if (lowerRole.includes("worker gr-1")) return "అంగన్వాడీ కార్యకర్త (GR-1)";
    if (lowerRole.includes("worker gr-2")) return "అంగన్వాడీ కార్యకర్త (GR-2)";
    if (lowerRole.includes("worker gr-3")) return "అంగన్వాడీ కార్యకర్త (GR-3)";
    if (lowerRole.includes("worker gr-4")) return "అంగన్వాడీ కార్యకర్త (GR-4)";
    if (lowerRole.includes("voa member")) return "VOA బృంద సభ్యురాలు";
    return role;
  };

  const getLocalizedStaffName = (name: string) => {
    if (language !== "te") return name;
    // Real staff Telugu mapping
    const mappings: { [key: string]: string } = {
      "Sunkara Veera Swamy": "సుంకర వీరస్వామి",
      "Lanka Kumar": "లంక కుమార్",
      "Valluri Pradeep": "వల్లూరి ప్రదీప్",
      "Dekka Krishna": "డెక్కా కృష్ణ",
      "Thotakura Durgaprasad": "తోటకూర దుర్గాప్రసాద్",
      "Gude Lavanya": "గుడే లావణ్య",
      "Ogireddy Santhoshi": "ఓగిరెడ్డి సంతోషి",
      "Elipey Gnana Bhushan": "ఎలిపే జ్ఞాన భూషణ్",
      "Nandam Satish": "నందం సతీష్",
      "Katta Prasad": "కట్టా ప్రసాద్",
      "P Saradha": "పి. శారద",
      "P Rathnam": "పి. రత్నం",
      "K Ramalaxmi": "కె. రామలక్ష్మి",
      "CH Surya Kumari": "సి.హెచ్. సూర్యకుమారి",
      "Lingam Murali": "లింగం మురళి",
      "K Jagadeeshwari": "కె. జగదీశ్వరి",
      "Satya Malasri": "సత్య మాలాశ్రీ"
    };
    return mappings[name] || name;
  };

  const filteredStaff = data.staff.filter((s: StaffMember) => {
    const matchesDept = activeDept === "All" || s.department === activeDept;
    const telName = getLocalizedStaffName(s.name);
    const telRole = getLocalizedRole(s.designation);
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      telName.includes(searchTerm) ||
      telRole.includes(searchTerm);
    return matchesDept && matchesSearch;
  });

  return (
    <div className="space-y-12">
      <SectionHeading
        badge={t("badge_directory")}
        title={t("directory_title")}
        subtitle={t("directory_subtitle")}
      />

      {/* Tabs Filter Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-205 dark:border-slate-800 pb-4">
        {/* Department badget tabs */}
        <div className="flex flex-wrap gap-2">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setActiveDept(dept)}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold border cursor-pointer transition ${
                activeDept === dept
                  ? "bg-gov-600 text-white border-transparent shadow shadow-gov-600/10"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200/50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-805"
              }`}
            >
              {getLocalizedDeptName(dept)}
            </button>
          ))}
        </div>

        {/* Search Search */}
        <div className="relative w-full md:max-w-xs shrink-0 font-sans">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={language === "te" ? "సిబ్బంది లేదా హోదాతో శోధించండి..." : "Search staff by name or job..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 text-sm border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-gov-600 dark:text-white focus:border-transparent transition"
          />
        </div>
      </div>

      {/* Staff Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.length > 0 ? (
          filteredStaff.map((member: StaffMember) => (
            <GlassCard
              key={member.id}
              hoverEffect
              className="flex flex-col justify-between p-6 bg-white/40 shadow-sm border-l-4 border-l-gov-500"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-400">
                    {getLocalizedDeptName(member.department)}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm md:text-base font-display font-black text-slate-900 dark:text-white leading-tight">
                    {getLocalizedStaffName(member.name)}
                  </h4>
                  <p className="text-xs text-gov-600 dark:text-gov-400 font-semibold mt-1">
                    {getLocalizedRole(member.designation)}
                  </p>
                </div>
              </div>

              {/* Action contacts row */}
              <div className="flex justify-between items-center scale-95 pt-4 mt-6 border-t border-slate-150/40 dark:border-slate-800">
                <a
                  href={`tel:${member.contact}`}
                  className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-gov-650 dark:text-slate-400 font-bold hover:underline font-mono"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  +91 {member.contact}
                </a>
                <button
                  onClick={() => copyToClipboard(member.contact)}
                  className="p-1.5 rounded-lg border border-transparent hover:bg-slate-100 dark:hover:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-800/60 transition text-slate-400 hover:text-slate-700 cursor-pointer"
                  title="Copy Phone"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </GlassCard>
          ))
        ) : (
          <div className="col-span-full py-16 text-center text-slate-400 text-sm">
            {language === "te" ? "ఎలాంటి ఉద్యోగి వివరాలు లభించలేదు." : "No matching staff directory records found."}
          </div>
        )}
      </div>
    </div>
  );
};
