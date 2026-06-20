/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useLanguage } from "../components/LanguageContext";
import { SectionHeading, GlassCard } from "../components/UIComponents";
import { VoterDistributionDonut } from "../components/CustomCharts";
import { Award, CheckCircle, ShieldCheck, HelpCircle } from "lucide-react";
import { DatabaseSchema } from "../types";

export const Voters: React.FC<{ data: DatabaseSchema }> = ({ data }) => {
  const { language, t } = useLanguage();
  const { voters } = data;

  if (!voters || voters.totalVoters == null) {
    return (
      <div className="space-y-12">
        <SectionHeading
          badge={t("nav_voters")}
          title={t("voter_title")}
          subtitle={language === "te" ? "ఓటర్ల డేటా త్వరలో నవీకరించబడుతుంది." : "Voter demographic data will be updated soon."}
        />
        <div className="text-center p-12 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
           <p className="text-slate-500 dark:text-slate-400">
             {language === "te" ? "ఈ గ్రామం లేదా వార్డు కోసం ఓటర్ల గణాంకాలు ఇంకా అందుబాటులో లేవు." : "Voter statistics are not yet available for this region."}
           </p>
        </div>
      </div>
    );
  }

  const subtitleWithCount = t("voter_subtitle").replace("{voters.totalVoters}", voters.totalVoters.toString());

  return (
    <div className="space-y-12">
      <SectionHeading
        badge={t("nav_voters")}
        title={t("voter_title")}
        subtitle={subtitleWithCount}
      />

      {/* Embedded Donut demographic visual chart */}
      <section className="grid grid-cols-1 gap-8">
        <VoterDistributionDonut
          male={voters.maleVoters || 0}
          female={voters.femaleVoters || 0}
          bc={voters.bcVoters || 0}
          sc={voters.scVoters || 0}
          st={voters.stVoters || 0}
        />
      </section>

      {/* Polling Infrastructure listings */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
        {/* Polling Station info */}
        <GlassCard hoverEffect={false} className="space-y-4 border-l-4 border-l-indigo-600">
          <h3 className="text-base font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-650" />
            {language === "te" ? "ఎన్నికల బూత్‌లు & పోలింగ్ కేంద్రాలు" : "Electoral Booth & Polling Stations"}
          </h3>

          <div className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">
                {language === "te" ? "గ్రామంలోని మొత్తం పోలింగ్ కేంద్రాలు" : "TOTAL POLLING STATIONS IN VILLAGE"}
              </span>
              <p className="text-2xl font-display font-black text-indigo-700 dark:text-indigo-400">
                {voters.totalPollingStations || 0} {language === "te" ? "పోలింగ్ బూత్‌లు" : "Booths"}
              </p>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
              {language === "te"
                ? "పోలింగ్ కేంద్రాలు వేండ్ర గ్రామ ప్రభుత్వ ఉన్నత పాఠశాల ప్రాంగణంలో అమర్చబడతాయి. వృద్ధులు మరియు దివ్యాంగులకు అనుకూలంగా వీల్‌చైర్ కాంక్రీట్ ర్యాంపులు, భద్రతా సదుపాయాలు మరియు సహాయక క్యూ లైన్లు ఉన్నాయి."
                : "Voting booths are located inside the central Government Junior High School complex. Both rooms are fully wheelchair accessible with concrete ramps, secure ballot lockers, electronic voting apparatus, and shaded queues for senior citizens."}
            </p>
          </div>
        </GlassCard>

        {/* Voting Requirements or Assistance details */}
        <GlassCard hoverEffect={false} className="space-y-4">
          <h3 className="text-base font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-slate-400" />
            {language === "te" ? "ఓటరు సేవలు & సహాయ కేంద్రం" : "Voter Services & Assistance"}
          </h3>

          <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed">
            {language === "te"
              ? "నమోదిత స్థానిక పౌరులు మా గ్రామ సచివాలయంలో కింది సేవలను పొందవచ్చు:"
              : `Registered residents of ${data.name} can perform the following services at our local Panchayat Sachivalayam (Digital Assistant Sri Valluri Pradeep):`}
          </p>

          <ul className="space-y-2 text-xs">
            <li className="flex items-center gap-2 text-slate-650 dark:text-slate-300">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>{language === "te" ? "నూతన ఓటరు నమోదు (ఫారం 6)" : "New Voter (Form 6) Registrative Admissions"}</span>
            </li>
            <li className="flex items-center gap-2 text-slate-650 dark:text-slate-300">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>{language === "te" ? "ఓటర్ కార్డుతో ఆధార్ అనుసంధానం" : "Aadhaar-to-ELEC Card linking diagnostics"}</span>
            </li>
            <li className="flex items-center gap-2 text-slate-650 dark:text-slate-300">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>{language === "te" ? "తప్పుల సవరణలు లేదా చిరునామా మార్పు (ఫారం 8)" : "Name corrections or word migrations (Form 8)"}</span>
            </li>
            <li className="flex items-center gap-2 text-slate-650 dark:text-slate-300">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>{language === "te" ? "ఓటర్ల జాబితా మరియు పోలింగ్ బూత్ సమాచార శోధన" : "Electoral Roll checking and booth number queries"}</span>
            </li>
          </ul>
        </GlassCard>
      </section>
    </div>
  );
};
