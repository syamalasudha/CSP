/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useLanguage } from "../components/LanguageContext";
import { SectionHeading, GlassCard } from "../components/UIComponents";
import { LandAllocationAcreBar } from "../components/CustomCharts";
import { Trees, Droplet, Zap, BookOpen, GraduationCap, LayoutGrid, CheckCircle } from "lucide-react";
import { DatabaseSchema } from "../types";

export const Infrastructure: React.FC<{ data: DatabaseSchema }> = ({ data }) => {
  const { language, t } = useLanguage();
  const { land, water, infrastructure, education } = data;

  return (
    <div className="space-y-12">
      <SectionHeading
        badge={t("nav_agriculture")}
        title={t("agriculture_title")}
        subtitle={t("agriculture_subtitle")}
      />

      {/* Embedded Chart + Land Stats Panel */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* SVG Land Class Bar Chart */}
        <div className="lg:col-span-7">
          <LandAllocationAcreBar
            wet={land.wetLandAcres}
            dry={land.dryLandAcres}
            poramboku={land.porambokuAcres}
            fisheries={land.fisheriesAcres}
            assigned={land.assignedAcres}
            endowments={land.endowmentsAcres}
            total={land.totalAayakattuAcres}
          />
        </div>

        {/* Land Stats Details Text Card */}
        <div className="lg:col-span-5 h-full space-y-6">
          <GlassCard hoverEffect={false} className="h-full space-y-4">
            <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Trees className="w-5 h-5 text-emerald-600" />
              {t("agriculture_survey_no")}
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">
                  {language === "te" ? "మొత్తం సర్వే నంబర్లు" : "Total Survey Numbers"}
                </span>
                <p className="text-xl font-display font-black text-slate-900 dark:text-white font-mono">{land.totalSurveyNumbers}</p>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">
                  {language === "te" ? "మొత్తం భూమి ఖాతాలు" : "Total Khathas"}
                </span>
                <p className="text-xl font-display font-black text-slate-900 dark:text-white font-mono">{land.totalKhathas}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
              {language === "te"
                ? `${data.name} గ్రామంలో పచ్చని వరి పొలాలు ప్రధాన్యత కలిగి ఉన్నాయి. కాల్వల ద్వారా మరియు లోతైన బోరుబావుల సహాయంతో 1236.38 ఎకరాల సాగు నీటి భూములకు నీరు అందుతుంది.`
                : `Wet cultivated lands dominate ${data.name}’s territory, comprising 1236.38 acres of fertile soils primarily growing high-quality paddy rice, supported by delta canal feeding and deep borewell irrigation grids.`}
            </p>
          </GlassCard>
        </div>
      </section>

      {/* split bottom: Water, Lights, and Education */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Drinking Water UtilityCard */}
        <GlassCard hoverEffect={false} className="space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Droplet className="w-5 h-5 text-blue-500 shrink-0" />
              {t("agriculture_water_source")}
            </h3>
            <span className="bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 px-2 py-0.5 rounded text-[9px] font-bold uppercase">
              {language === "te" ? "బోరు బావి" : "Bore Well"}
            </span>
          </div>

          <ul className="space-y-3.5 text-xs text-slate-600 dark:text-slate-400 font-sans">
            <li className="flex justify-between items-center">
              <span>{language === "te" ? "ప్రధాన నీటి వనరు:" : "Main Bore Well Source:"}</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {language === "te" ? "చితపల్లి సమీపంలో" : "Near Chithapalli"}
              </span>
            </li>
            <li className="flex justify-between items-center">
              <span>{language === "te" ? "ఓవర్‌హెడ్ ట్యాంక్ సామర్థ్యం:" : "Overhead Tank Capacity:"}</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {language === "te" ? "1,20,000 లీటర్లు" : "1,20,000 Litres"}
              </span>
            </li>
            <li className="flex justify-between items-center">
              <span>{language === "te" ? "రోజువారీ నీటి సరఫరా (మనిషికి):" : "Supply Per Person Per Day:"}</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {language === "te" ? "55 లీటర్లు" : "55 Litres"}
              </span>
            </li>
            <li className="flex justify-between items-center">
              <span>{language === "te" ? "వ్యక్తిగత కనెక్షన్లు:" : "Installed Private Taps:"}</span>
              <span className="font-semibold text-slate-900 dark:text-white font-mono">{water.privateTaps}</span>
            </li>
            <li className="flex justify-between items-center">
              <span>{language === "te" ? "ప్రజా స్టాండ్ కుళాయిలు:" : "Active Public Stand Taps:"}</span>
              <span className="font-semibold text-slate-900 dark:text-white font-mono">{water.publicTaps}</span>
            </li>
          </ul>
        </GlassCard>

        {/* Public LED Lights Card */}
        <GlassCard hoverEffect={false} className="space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500 shrink-0" />
              {t("agriculture_lighting")}
            </h3>
            <span className="bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 px-2 py-0.5 rounded text-[9px] font-bold uppercase">LED 240</span>
          </div>

          <div className="space-y-4 font-sans text-xs text-slate-600 dark:text-slate-400">
            <p className="leading-relaxed">
              {language === "te"
                ? "గ్రామంలోని వీధి దీపాలన్నిటినీ తక్కువ ఖర్చుతో ఎక్కువ వెలుతురునిచ్చే ఎల్ఈడి (LED) బల్బులతో అమర్చి CCMS టైమర్ల ద్వారా నియంత్రిస్తున్నారు."
                : "Street illumination in Vendra has been 100% retrofitted to low-energy high-lumens LED units, governed by automatic centralized timers."}
            </p>

            <ul className="space-y-3 text-xs">
              <li className="flex justify-between items-center">
                <span>{language === "te" ? "అమర్చిన వీధి దీపాలు:" : "Installed LED Bulbs:"}</span>
                <span className="font-semibold text-slate-900 dark:text-white font-mono">{infrastructure.ledStreetLights} Points</span>
              </li>
              <li className="flex justify-between items-center">
                <span>{language === "te" ? "CCMS ఆటోమాటిక్ బాక్సులు:" : "Installed CCMS Auto-Boxes:"}</span>
                <span className="font-semibold text-slate-900 dark:text-white font-mono">{infrastructure.ccmsBoxes} Boxes</span>
              </li>
            </ul>
          </div>
        </GlassCard>

        {/* Public Education Institutions */}
        <GlassCard hoverEffect={false} className="space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-emerald-500 shrink-0" />
              {t("agriculture_education")}
            </h3>
            <span className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 px-2 py-0.5 rounded text-[9px] font-bold uppercase">Govt</span>
          </div>

          <ul className="space-y-3.5 text-xs text-slate-600 dark:text-slate-400 font-sans">
            <li className="flex justify-between items-center">
              <span>{language === "te" ? "ప్రభుత్వ ప్రాథమిక పాఠశాలలు:" : "Government Primary Schools:"}</span>
              <span className="font-bold text-slate-900 dark:text-white">{education.govtSchools} {language === "te" ? "కేంద్రాలు" : "Centers"}</span>
            </li>
            <li className="flex justify-between items-center">
              <span>{language === "te" ? "ప్రభుత్వ ఉన్నత పాఠశాలలు:" : "Government High Schools:"}</span>
              <span className="font-bold text-slate-900 dark:text-white">{education.highSchools} {language === "te" ? "పాఠశాల" : "Institution"}</span>
            </li>
            <li className="flex justify-between items-center">
              <span>{language === "te" ? "క్రియాశీల అంగన్‌వాడీ కేంద్రాలు:" : "Active Anganwadi Centers:"}</span>
              <span className="font-bold text-slate-900 dark:text-white">{education.anganwadiCenters} {language === "te" ? "కేంద్రాలు" : "Locations"}</span>
            </li>
            <li className="pt-2 text-slate-400 leading-snug text-[10px]">
              {language === "te"
                ? "*ఉన్నత పాఠశాలలు మరియు ప్రాథమిక కేంద్రాలు రాష్ట్ర ప్రభుత్వ 'మన బడి నాడు-నేడు' పథకం కింద నవీకరించబడినవి."
                : "*High schools and primary centers are covered under the state’s Mana Badi Nadu-Nedu digital infrastructure refurbishments."}
            </li>
          </ul>
        </GlassCard>
      </section>
    </div>
  );
};
