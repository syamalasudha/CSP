/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { GlassCard, AnimatedCounter } from "../components/UIComponents";
import { useLanguage } from "../components/LanguageContext";
import { Users, Trees, Home as HomeIcon, Map, ShieldCheck, Zap, Megaphone, ArrowRight, Landmark } from "lucide-react";
import { DatabaseSchema } from "../types";

interface HomeProps {
  data: DatabaseSchema;
  onNavigate: (page: string) => void;
}

export const Home: React.FC<HomeProps> = ({ data, onNavigate }) => {
  const { language, t } = useLanguage();
  const recentAnnouncements = data.announcements.slice(0, 3);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Meeting": return "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300";
      case "Alert": return "bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300";
      case "Welfare": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300";
      default: return "bg-gov-100 text-gov-800 dark:bg-gov-950/40 dark:text-gov-200";
    }
  };

  return (
    <div className="space-y-12">
      {/* Hero Banner Section */}
      <section className="relative rounded-3xl overflow-hidden bg-slate-950 text-white shadow-xl">
        <div className="absolute inset-0 z-0 bg-slate-950">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1600"
            alt={`${data.name} Village background`}
            className="w-full h-full object-cover opacity-35"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        </div>

        <div className="relative z-10 px-6 py-16 md:py-24 max-w-4xl mx-auto text-center space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-display uppercase tracking-widest leading-none">
            {t("home_welcome_badge")}
          </span>
          <h1 className="text-3xl md:text-5xl font-display font-black tracking-tight leading-tight">
            {t("portal_title")}
            <span className="block mt-2 bg-gradient-to-r from-gov-400 to-emerald-400 bg-clip-text text-transparent text-xl md:text-3xl">
              {language === "te" ? `${data.mandalTe || data.mandal} మండలం, ${data.districtTe || data.district} జిల్లా` : `${data.mandal} Mandal, ${data.district} District`}
            </span>
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t("home_welcome_desc")}
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate("admin-details")}
              className="px-6 py-3 bg-gov-600 hover:bg-gov-700 text-sm font-bold rounded-xl transition shadow-lg shadow-gov-600/15 flex items-center gap-2 cursor-pointer"
            >
              {t("admin_board")}
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
  onClick={() => onNavigate("citizen-services")}
  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-sm font-bold rounded-xl transition shadow-lg flex items-center gap-2"
>
  {t("nav_services")}
  <ArrowRight className="w-4 h-4" />
</button>
            <button
              onClick={() => onNavigate("contact")}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 hover:text-white text-sm font-bold rounded-xl border border-slate-700 transition cursor-pointer"
            >
              {t("lodge_complaint")}
            </button>
          </div>
        </div>
      </section>

      {/* Dynamic Statistics Counters */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard hoverEffect className="flex flex-col items-center text-center p-6 bg-gov-50/20">
          <div className="p-3 bg-gov-100 dark:bg-gov-950 text-gov-700 dark:text-gov-400 rounded-2xl mb-4 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <span className="text-3xl md:text-4xl font-display font-black text-slate-900 dark:text-white">
            <AnimatedCounter end={data.stats.population} />
          </span>
          <span className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1 uppercase tracking-wider">
            {t("stats_population")}
          </span>
        </GlassCard>

        <GlassCard hoverEffect className="flex flex-col items-center text-center p-6 bg-gov-50/20">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 rounded-2xl mb-4 shrink-0">
            <Trees className="w-6 h-6" />
          </div>
          <span className="text-3xl md:text-4xl font-display font-black text-slate-900 dark:text-white">
            <AnimatedCounter end={data.stats.areaSqKm} suffix=" Km²" decimal={true} />
          </span>
          <span className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1 uppercase tracking-wider">
            {t("stats_area")}
          </span>
        </GlassCard>

        <GlassCard hoverEffect className="flex flex-col items-center text-center p-6 bg-gov-50/20">
          <div className="p-3 bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 rounded-2xl mb-4 shrink-0">
            <HomeIcon className="w-6 h-6" />
          </div>
          <span className="text-3xl md:text-4xl font-display font-black text-slate-900 dark:text-white">
            <AnimatedCounter end={data.stats.totalHouseholds} />
          </span>
          <span className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1 uppercase tracking-wider">
            {t("stats_households")}
          </span>
        </GlassCard>

        <GlassCard hoverEffect className="flex flex-col items-center text-center p-6 bg-gov-50/20">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 rounded-2xl mb-4 shrink-0">
            <Map className="w-6 h-6" />
          </div>
          <span className="text-3xl md:text-4xl font-display font-black text-slate-900 dark:text-white">
            <AnimatedCounter end={data.stats.totalWards} />
          </span>
          <span className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1 uppercase tracking-wider">
            {t("stats_wards")}
          </span>
        </GlassCard>
      </section>

      {/* Main Split Row: Notices and Portals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Notices and Announcements Board */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2.5">
            <Megaphone className="w-5 h-5 text-gov-600 shrink-0 animate-bounce" />
            <h2 className="text-xl md:text-2xl font-display font-bold text-slate-900 dark:text-white">
              {t("home_announcements_title")}
            </h2>
          </div>

          <div className="space-y-4">
            {recentAnnouncements.length > 0 ? (
              recentAnnouncements.map((ann) => (
                <div
                  key={ann.id}
                  className="bg-white dark:bg-slate-900/60 border border-slate-205 dark:border-slate-800/60 rounded-2xl p-5 hover:border-gov-600/25 dark:hover:border-gov-650/25 shadow-sm hover:shadow dark:shadow-none transition-all duration-300"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${getCategoryColor(ann.category)}`}>
                      {language === "te"
                        ? ann.category === "Welfare" ? "సంక్షేమం"
                          : ann.category === "Meeting" ? "సమావేశం"
                          : ann.category === "Alert" ? "హాట్ అలర్ట్"
                          : "సాధారణం"
                        : ann.category}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{ann.date}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-950 dark:text-white mb-2 leading-snug">
                    {ann.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                    {ann.content}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 text-center py-8">
                {language === "te" ? "ప్రస్తుతం ఎలాంటి నోటీసులు లేవు." : "No announcements available."}
              </p>
            )}
            <button
              onClick={() => onNavigate("gallery")}
              className="w-full py-3 bg-slate-50 dark:bg-slate-900/40 text-xs font-bold rounded-xl text-slate-600 dark:text-slate-350 border border-slate-200/40 dark:border-slate-800/40 hover:text-gov-600 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {language === "te" ? "గ్రామ చిత్రాలు మరియు కార్యకలాపాలను అన్వేషించండి" : "Explore Village Activities & Gallery"}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Citizen Navigation Portals */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Landmark className="w-5 h-5 text-gov-600 shrink-0" />
            <h2 className="text-xl md:text-2xl font-display font-bold text-slate-900 dark:text-white">
              {language === "te" ? "పౌర సేవలు" : "Citizen Directories"}
            </h2>
          </div>

          <div className="space-y-3.5">
            <div
              onClick={() => onNavigate("staff")}
              className="flex justify-between items-center p-4 bg-gradient-to-r from-gov-50 to-white dark:from-slate-900 dark:to-slate-900/40 border border-gov-100/30 dark:border-slate-800 rounded-2xl cursor-pointer hover:shadow-md transition duration-200 group"
            >
              <div className="space-y-1">
                <span className="text-[10px] text-gov-600 font-bold uppercase tracking-wider font-display">
                  {t("group_sachivalayam")}
                </span>
                <p className="text-sm font-bold text-slate-950 dark:text-white leading-tight">
                  {language === "te" ? "సచివాలయ ఉద్యోగుల ఫోన్ నంబర్లు" : "Contact Local Bureaucracy"}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-gov-600 group-hover:translate-x-1 transition" />
            </div>

            <div
              onClick={() => onNavigate("agriculture")}
              className="flex justify-between items-center p-4 bg-gradient-to-r from-emerald-50/60 to-white dark:from-slate-900 dark:to-slate-900/40 border border-emerald-100/30 dark:border-slate-800 rounded-2xl cursor-pointer hover:shadow-md transition duration-200 group"
            >
              <div className="space-y-1">
                <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider font-display">
                  {t("nav_agriculture")}
                </span>
                <p className="text-sm font-bold text-slate-950 dark:text-white leading-tight">
                  {language === "te" ? "ఆయకట్టు మరియు సాగు నీటి నివేదికలు" : "Aayakattu & Wet Irrigation Details"}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition" />
            </div>

            <div
              onClick={() => onNavigate("welfare")}
              className="flex justify-between items-center p-4 bg-gradient-to-r from-amber-50/60 to-white dark:from-slate-900 dark:to-slate-900/40 border border-amber-100/30 dark:border-slate-800 rounded-2xl cursor-pointer hover:shadow-md transition duration-200 group"
            >
              <div className="space-y-1">
                <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider font-display">
                  {t("badge_pensions")}
                </span>
                <p className="text-sm font-bold text-slate-950 dark:text-white leading-tight">
                  {language === "te" ? "డ్వాక్రా సంఘాలు & పింఛనుదారులు" : "SHG Loans & Pension Schemes"}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition" />
            </div>

            <div
              onClick={() => onNavigate("voters")}
              className="flex justify-between items-center p-4 bg-gradient-to-r from-indigo-50/50 to-white dark:from-slate-900 dark:to-slate-900/40 border border-indigo-100/30 dark:border-slate-800 rounded-2xl cursor-pointer hover:shadow-md transition duration-200 group"
            >
              <div className="space-y-1">
                <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider font-display">
                  {t("voter_category_ratio")}
                </span>
                <p className="text-sm font-bold text-slate-950 dark:text-white leading-tight">
                  {language === "te" ? "పోలింగ్ కేంద్రం & వర్గాల ఓటర్లు" : "Polling Station & Voters Cast Rates"}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
