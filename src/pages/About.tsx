/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useLanguage } from "../components/LanguageContext";
import { SectionHeading, GlassCard, VillageMapShadowbox } from "../components/UIComponents";
import { MapPin, ShieldAlert, Award, Compass, Heart } from "lucide-react";
import { DatabaseSchema } from "../types";

export const About: React.FC<{ data: DatabaseSchema }> = ({ data }) => {
  const { language, t } = useLanguage();

  return (
    <div className="space-y-12">
      <SectionHeading
        badge={t("nav_about")}
        title={t("about_title")}
        subtitle={t("about_subtitle")}
      />

      {/* Main Grid: Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <GlassCard hoverEffect={false} className="space-y-4">
          <div className="p-3 bg-gov-50 dark:bg-slate-900 rounded-2xl w-fit text-gov-700 shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-display font-bold text-slate-950 dark:text-white">
            {t("about_card_landscape")}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
            {t("about_landscape_p1")}
          </p>
        </GlassCard>

        <GlassCard hoverEffect={false} className="space-y-4">
          <div className="p-3 bg-emerald-50 dark:bg-slate-900 rounded-2xl w-fit text-emerald-700 shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-display font-bold text-slate-950 dark:text-white">
            {t("about_card_history")}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
            {t("about_history_p1")} {t("about_history_p2")}
          </p>
        </GlassCard>

        <GlassCard hoverEffect={false} className="space-y-4">
          <div className="p-3 bg-amber-50 dark:bg-slate-900 rounded-2xl w-fit text-amber-700 shrink-0">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-display font-bold text-slate-950 dark:text-white">
            {t("about_card_vision")}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
            {t("about_vision_p1")}
          </p>
        </GlassCard>
      </div>

      {/* Map visual split block */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
            {language === "te" ? "గ్రామ భౌగోళిక సరిహద్దు సమాచారం" : "Digital Location Registry"}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
            {language === "te"
              ? "కాకినాడ నగరానికి సుమారు 18 కిలోమీటర్ల దూరంలో ఉన్న వేండ్ర గ్రామం జిల్లా రహదారుల ద్వారా అనుసంధానించబడి ఉంది. సులభమైన రవాణా మరియు వస్తువుల చేరవేతకు అనుకూలమైన రోడ్డు నెట్‌వర్క్ దీని స్వంతం."
              : "The Gram Panchayat administration boundary covers our residential wards, historical ponds, and wet agricultural fields. Vendra is linked directly via major district roads to Kakinada city (some 18 kms away), making transportation and supply corridors accessible."}
          </p>
          <div className="space-y-3 font-sans">
            <div className="flex items-center gap-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <MapPin className="w-4 h-4 text-gov-600" />
              <span>{language === "te" ? "జిల్లా ప్రధాన కార్యాలయం: కాకినాడ (18 కి.మీ)" : "District Headquarter: Kakinada (18 km)"}</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>{language === "te" ? "మండల ప్రజా పరిషత్ ముఖద్వారం: పెదపూడి (6.5 కి.మీ)" : "Mandal Office: Pedapudi (6.5 km)"}</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span>{language === "te" ? "సచివాలయం కోడ్: 10590885 (డిజిటల్ సహాయం)" : "Panchayat Sachivalayam Code: 10590885"}</span>
            </div>
          </div>
        </div>

        {/* Real Dynamic Map */}
        <VillageMapShadowbox />
      </div>
    </div>
  );
};
