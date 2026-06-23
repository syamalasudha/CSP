/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useLanguage } from "../components/LanguageContext";
import { SectionHeading, GlassCard } from "../components/UIComponents";
import { LandAllocationAcreBar } from "../components/CustomCharts";
import { Trees, Droplet, Zap, BookOpen, GraduationCap, LayoutGrid, CheckCircle, Bath, Navigation, Building2 } from "lucide-react";
import { DatabaseSchema } from "../types";

export const Infrastructure: React.FC<{ data: DatabaseSchema }> = ({ data }) => {
  const { language, t } = useLanguage();
  const { land, water, infrastructure, education, sanitation, roads, facilities } = data;

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
            publicCommon={land.publicCommonAcres}
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

      {/* Extended Infrastructure Summary (from extra DB fields) */}
      <section>
        <GlassCard hoverEffect={false} className="space-y-4">
          <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
            {language === "te" ? "విస్తృత వసతుల సారాంశం" : "Extended Infrastructure Summary"}
          </h3>

          <div className="text-sm text-slate-700 dark:text-slate-300 space-y-3">
            {data.socialCategories && (
              <p>
                <strong>{language === "te" ? "సామాజిక వర్గాల జనसंఖ్యా:" : "Social categories:"}</strong>
                {` SC: ${data.socialCategories.scPopulation ?? "N/A"}, ST: ${data.socialCategories.stPopulation ?? "N/A"}`}
              </p>
            )}

            {data.hospitals && (
              <p>
                <strong>{language === "te" ? "ఆసుపత్రులు:" : "Hospitals:"}</strong>
                {` ${data.hospitals.total?.total ?? data.hospitals.total ?? "N/A"} total (Gov: ${data.hospitals.government?.total ?? data.hospitals.government ?? "N/A"}, Private: ${data.hospitals.private?.total ?? data.hospitals.private ?? "N/A"})`}
              </p>
            )}

            {data.educationDetailed && (
              <p>
                <strong>{language === "te" ? "విద్య శ్రేణి:" : "Education:"}</strong>
                {` Schools: ${data.educationDetailed.schools?.totalSchools ?? "N/A"}, Colleges: ${data.educationDetailed.colleges?.totalColleges ?? "N/A"}`}
              </p>
            )}

            {data.markets && (
              <p>
                <strong>{language === "te" ? "బజార్లు:" : "Markets:"}</strong>
                {` Total markets: ${data.markets.totalMarkets ?? "N/A"}`}
              </p>
            )}

            {data.burialGrounds && (
              <p>
                <strong>{language === "te" ? "చైతన్య స్థలాలు:" : "Burial Grounds:"}</strong>
                {` Total: ${data.burialGrounds.total ?? "N/A"}`}
              </p>
            )}

            {data.waterBodies && (
              <p>
                <strong>{language === "te" ? "జలాశయాలు:" : "Water bodies:"}</strong>
                {` Tanks: ${data.waterBodies.totalTanks ?? "N/A"}`}
              </p>
            )}

            {data.streetLights && (
              <p>
                <strong>{language === "te" ? "వీధి దీపాలు:" : "Street lights:"}</strong>
                {` Total lights: ${data.streetLights.totalLights ?? "N/A"}, Poles without lights: ${data.streetLights.polesWithoutLights ?? "N/A"}`}
              </p>
            )}

            {data.trade && (
              <p>
                <strong>{language === "te" ? "వాణిజ్య గణాంకాలు:" : "Trade:"}</strong>
                {` Businesses: ${data.trade.doTrades ?? "N/A"}, Market revenue: ₹${data.revenue?.marketRevenueLakhs ?? "N/A"} Lakhs`}
              </p>
            )}

            {data.planning && (
              <p>
                <strong>{language === "te" ? "నిర్వాహణా ప్రణాళికలు:" : "Planning:"}</strong>
                {` Approved layouts: ${data.planning.approvedLayoutPlans ?? "N/A"}`}
              </p>
            )}
          </div>
        </GlassCard>
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
              <span>{language === "te" ? "ప్రధాన నీటి వనరు:" : "Main Water Source:"}</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {language === "te" && water.source === "Near Chithapalli" ? "చితపల్లి సమీపంలో" : (water.source || "N/A")}
              </span>
            </li>
            <li className="flex justify-between items-center">
              <span>{language === "te" ? "ఓవర్‌హెడ్/SS ట్యాంక్ సామర్థ్యం:" : "Tank Capacity:"}</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {water.ssTankCapacityMl ? `${water.ssTankCapacityMl} ML` : (water.overheadTankLitres ? `${water.overheadTankLitres.toLocaleString()} L` : "N/A")}
              </span>
            </li>
            <li className="flex justify-between items-center">
              <span>{language === "te" ? "రోజువారీ నీటి సరఫరా (మనిషికి):" : "Supply Per Person Per Day:"}</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {water.supplyPerHeadLitresDay ? `${water.supplyPerHeadLitresDay} Litres` : "N/A"}
              </span>
            </li>
            <li className="flex justify-between items-center">
              <span>{language === "te" ? "పైపుల ద్వారా కవరేజ్ (శాతం):" : "Piped Water Coverage:"}</span>
              <span className="font-semibold text-slate-900 dark:text-white font-mono">{water.areaCoveredByPipedWaterPercent ? `${water.areaCoveredByPipedWaterPercent}%` : "N/A"}</span>
            </li>
            <li className="flex justify-between items-center">
              <span>{language === "te" ? "వ్యక్తిగత కనెక్షన్లు:" : "Installed Private Taps:"}</span>
              <span className="font-semibold text-slate-900 dark:text-white font-mono">{water.privateTaps ?? "N/A"}</span>
            </li>
            <li className="flex justify-between items-center">
              <span>{language === "te" ? "ప్రజా స్టాండ్ కుళాయిలు:" : "Active Public Stand Taps:"}</span>
              <span className="font-semibold text-slate-900 dark:text-white font-mono">{water.publicTaps ?? "N/A"}</span>
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
              <span>{language === "te" ? "ప్రభుత్వ ప్రాథమిక పాఠశాలలు:" : "Primary/Elementary Schools:"}</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {(education.elementarySchools || education.govtSchools) ?? 0} {language === "te" ? "కేంద్రాలు" : "Centers"}
              </span>
            </li>
            <li className="flex justify-between items-center">
              <span>{language === "te" ? "ప్రభుత్వ ఉన్నత పాఠశాలలు:" : "Government High Schools:"}</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {education.highSchools ?? 0} {language === "te" ? "పాఠశాల" : "Institution"}
              </span>
            </li>
            {education.juniorColleges && (
              <li className="flex justify-between items-center">
                <span>{language === "te" ? "జూనియర్ కళాశాలలు:" : "Junior Colleges:"}</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {education.juniorColleges} {language === "te" ? "కళాశాల" : "College"}
                </span>
              </li>
            )}
            <li className="flex justify-between items-center">
              <span>{language === "te" ? "క్రియాశీల అంగన్‌వాడీ కేంద్రాలు:" : "Active Anganwadi Centers:"}</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {education.anganwadiCenters ?? 0} {language === "te" ? "కేంద్రాలు" : "Locations"}
              </span>
            </li>
            <li className="pt-2 text-slate-400 leading-snug text-[10px]">
              {language === "te"
                ? "*ఉన్నత పాఠశాలలు మరియు ప్రాథమిక కేంద్రాలు రాష్ట్ర ప్రభుత్వ 'మన బడి నాడు-నేడు' పథకం కింద నవీకరించబడినవి."
                : "*High schools and primary centers are covered under the state’s Mana Badi Nadu-Nedu digital infrastructure refurbishments."}
            </li>
          </ul>
        </GlassCard>
      </section>

      {/* Row 3: Sanitation, Roads, Facilities */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sanitation Card */}
        {sanitation && (
          <GlassCard hoverEffect={false} className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Bath className="w-5 h-5 text-teal-500 shrink-0" />
                {language === "te" ? "పారిశుద్ధ్యం" : "Sanitation"}
              </h3>
            </div>
            <ul className="space-y-3.5 text-xs text-slate-600 dark:text-slate-400 font-sans">
              <li className="flex justify-between items-center">
                <span>{language === "te" ? "పారిశుద్ధ్య కార్మికులు (శాశ్వత/కాంట్రాక్ట్):" : "Sanitation Workers (Perm/Contract):"}</span>
                <span className="font-semibold text-slate-900 dark:text-white font-mono">{sanitation.permanentWorkers || 0} / {sanitation.contractWorkers || 0}</span>
              </li>
              <li className="flex justify-between items-center">
                <span>{language === "te" ? "కమ్యూనిటీ మరుగుదొడ్లు:" : "Community Toilets:"}</span>
                <span className="font-semibold text-slate-900 dark:text-white font-mono">{sanitation.communityToilets || 0}</span>
              </li>
              <li className="flex justify-between items-center">
                <span>{language === "te" ? "మరుగుదొడ్లు ఉన్న ఇళ్లు:" : "Households with Toilets:"}</span>
                <span className="font-semibold text-slate-900 dark:text-white font-mono">{sanitation.householdsWithToilets || 0}</span>
              </li>
              <li className="flex justify-between items-center">
                <span>{language === "te" ? "మరుగుదొడ్లు లేని ఇళ్లు:" : "Households without Toilets:"}</span>
                <span className="font-semibold text-slate-900 dark:text-white font-mono">{sanitation.householdsWithoutToilets || 0}</span>
              </li>
            </ul>
          </GlassCard>
        )}

        {/* Roads & Drainage Card */}
        {roads && (
          <GlassCard hoverEffect={false} className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Navigation className="w-5 h-5 text-indigo-500 shrink-0" />
                {language === "te" ? "రహదారులు & డ్రైనేజీ" : "Roads & Drainage"}
              </h3>
            </div>
            <ul className="space-y-3.5 text-xs text-slate-600 dark:text-slate-400 font-sans">
              <li className="flex justify-between items-center">
                <span>{language === "te" ? "మునిసిపల్ రోడ్లు (కి.మీ):" : "Municipal Roads (Km):"}</span>
                <span className="font-semibold text-slate-900 dark:text-white font-mono">{roads.municipalRoadsKm?.total || "N/A"}</span>
              </li>
              <li className="flex justify-between items-center">
                <span>{language === "te" ? "R&B రోడ్లు (కి.మీ):" : "R&B Roads (Km):"}</span>
                <span className="font-semibold text-slate-900 dark:text-white font-mono">{roads.rbRoadsKm?.total || "N/A"}</span>
              </li>
              <li className="flex justify-between items-center">
                <span>{language === "te" ? "జాతీయ రహదారి (కి.మీ):" : "National Highways (Km):"}</span>
                <span className="font-semibold text-slate-900 dark:text-white font-mono">{roads.nationalHighwaysKm || "N/A"}</span>
              </li>
            </ul>
          </GlassCard>
        )}

        {/* Trade & Facilities Card */}
        {facilities && (
          <GlassCard hoverEffect={false} className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-rose-500 shrink-0" />
                {language === "te" ? "వాణిజ్యం & వసతులు" : "Trade & Facilities"}
              </h3>
            </div>
            <ul className="space-y-3.5 text-xs text-slate-600 dark:text-slate-400 font-sans">
              <li className="flex justify-between items-center">
                <span>{language === "te" ? "హోటళ్ళు / లాడ్జీలు:" : "Hotels / Lodges:"}</span>
                <span className="font-semibold text-slate-900 dark:text-white font-mono">
                  {facilities.hotels ?? 0} / {facilities.lodges ?? 0}
                </span>
              </li>
              <li className="flex justify-between items-center">
                <span>{language === "te" ? "కళ్యాణ మండపాలు:" : "Function Halls:"}</span>
                <span className="font-semibold text-slate-900 dark:text-white font-mono">{facilities.functionHalls ?? 0}</span>
              </li>
              <li className="flex justify-between items-center">
                <span>{language === "te" ? "సినిమా థియేటర్లు:" : "Theatres:"}</span>
                <span className="font-semibold text-slate-900 dark:text-white font-mono">{facilities.theatres ?? 0}</span>
              </li>
              <li className="flex justify-between items-center">
                <span>{language === "te" ? "బ్యాంకు శాఖలు / మీసేవ:" : "Bank Branches / MeeSeva:"}</span>
                <span className="font-semibold text-slate-900 dark:text-white font-mono">
                  {facilities.bankBranches ?? 0} / {facilities.meeSevaCentres ?? 0}
                </span>
              </li>
            </ul>
          </GlassCard>
        )}
      </section>
    </div>
  );
};
