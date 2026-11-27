/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useLanguage } from "../components/LanguageContext";
import { SectionHeading, GlassCard } from "../components/UIComponents";
import { PensionStructureBar } from "../components/CustomCharts";
import { Award, Landmark, Wallet, CheckCircle } from "lucide-react";
import { DatabaseSchema } from "../types";

export const Welfare: React.FC<{ data: DatabaseSchema }> = ({ data }) => {
  const { language, t } = useLanguage();
  const { pensions, shg, ration } = data;

  return (
    <div className="space-y-12">
      <SectionHeading
        badge={t("nav_welfare")}
        title={t("welfare_title")}
        subtitle={t("welfare_subtitle")}
      />

      {/* Embedded Pension Chart Section */}
      <section className="grid grid-cols-1 gap-8">
        <PensionStructureBar
          oap={pensions.oap}
          disabled={pensions.disabled}
          widow={pensions.widow}
          tTappers={pensions.tTappers}
          singleWomen={pensions.singleWomen}
          dmho={pensions.dmho}
          artists={pensions.artists}
          abh={pensions.abh}
          cobbler={pensions.cobbler}
          total={pensions.total}
        />
      </section>

      {/* Bottom Split: SHG and Ration Distribution details */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Swashakthi Self Help Groups SHGs Card */}
        <GlassCard hoverEffect={false} className="space-y-5 border-l-4 border-l-emerald-600">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Landmark className="w-5 h-5 text-emerald-600 shrink-0" />
              {language === "te" ? "మహిళా స్వయం సహాయక సంఘాలు (SHG)" : "Empowered Self Help Groups (SHGs)"}
            </h3>
            <span className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold">85 {language === "te" ? "సంఘాలు" : "GROUPS"}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">
                {language === "te" ? "మొత్తం స్వయం సహాయక సంఘాలు" : "Total Self Help Groups"}
              </span>
              <p className="text-xl font-display font-black text-slate-950 dark:text-white">{shg.totalGroups} {language === "te" ? "సంఘాలు" : "groups"}</p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">
                {language === "te" ? "యాక్టివ్ బ్యాంక్ లింకేజీ రుణాలు" : "Active Bank Linkage Loans"}
              </span>
              <p className="text-xl font-display font-black text-slate-950 dark:text-white">{shg.groupsWithBankLoans} {language === "te" ? "సంఘాలు" : "groups"}</p>
            </div>
          </div>

          <div className="p-4 bg-emerald-50/40 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-950 rounded-xl flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold uppercase">
                {language === "te" ? "మొత్తం మంజూరైన రుణ మూలధనం" : "Total Disbursed Capital Loans"}
              </span>
              <p className="text-lg font-display font-black text-emerald-800 dark:text-emerald-300 font-mono">
                ₹ {shg.totalLoanAmountLakhs} {language === "te" ? "లక్షలు" : "Lakhs"}
              </p>
            </div>
            <Wallet className="w-8 h-8 text-emerald-600/30 hidden sm:block shrink-0" />
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
            {language === "te"
              ? "SERP కింద కోపరేటివ్ మహిళా సంఘాలు మా గ్రామంలో 100% బ్యాంక్ లోన్ లింకింగ్ విజయాన్ని సాధించాయి."
              : `Cooperative female collectives under SERP represent 100% bank loan linking success rate in ${data.name}. Funds are deployed for organic farming tools, small retail shops, and backyard dairy production.`}
          </p>
        </GlassCard>

        {/* Public Ration Distribution Card */}
        <GlassCard hoverEffect={false} className="space-y-5 border-l-4 border-l-gov-600">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-gov-600 shrink-0" />
              {language === "te" ? "ప్రజా పంపిణీ వ్యవస్థ (PDS Ration)" : "Public Distribution System (PDS)"}
            </h3>
            <span className="bg-gov-50 text-gov-700 dark:bg-gov-950/40 dark:text-pink-300 px-2 py-0.5 rounded text-[10px] font-bold">1 FP SHOP</span>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase block font-display">
              {language === "te" ? "పంపిణీ చేయబడిన బియ్యం కార్డుల సంఖ్య" : "Active Rice Cards Disbursed"}
            </span>
            <p className="text-2xl font-display font-black text-slate-900 dark:text-white">
              {ration.riceCards} {language === "te" ? "కార్డులు" : "active cards"}
            </p>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
            {language === "te"
              ? "గ్రామ ప్రధాన రహదారి సమీపంలోని ప్రభుత్వ చౌక ధరల దుకాణం ద్వారా నిత్యావసర సరకుల పంపిణీ జరుగుతుంది. సుమారు 1,013 కుటుంబాలు ఈ రాయితీ రేషన్ మరియు పోషక పప్పుధాన్యాల సరఫరా ద్వారా లబ్ధి పొందుతున్నారు."
              : "Essential food provisioning is handled by a dedicated government Fair Price (FP) Shop located near the main road. 1,013 families benefit from monthly subsidies of polished sorting rice, whole wheat, and essential pulses under state DBT."}
          </p>

          <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 font-sans">
            <CheckCircle className="w-4 h-4" />
            <span>
              {language === "te" ? "100% బయోమెట్రిక్ e-PoS వెరిఫికేషన్ ద్వారా పారదర్శక పంపిణీ" : "100% Biometric e-PoS Verification enabled"}
            </span>
          </div>
        </GlassCard>
      </section>
    </div>
  );
};
