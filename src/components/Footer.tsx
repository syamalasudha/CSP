/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useLanguage } from "./LanguageContext";
import { Landmark, Phone, Mail, MapPin, CheckCircle } from "lucide-react";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { language, t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 dark:bg-slate-950 border-t border-slate-800/80 pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-gov-600 text-white rounded-lg">
                <Landmark className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-display font-bold text-white tracking-tight">
                {t("portal_title")}
              </h3>
            </div>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              {language === "te"
                ? "పెదపూడి మండలం, కాకినాడ జిల్లా పరిధిలోని వేండ్ర గ్రామ నివాసితుల కోసం అధికారిక డిజిటల్ పరిపాలన మరియు పౌర సేవల రిజిస్ట్రీ."
                : "Official digital governance and citizen service registry for Vendra Village, Pedapudi Mandal, Kakinada District, Andhra Pradesh."}
            </p>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
              <CheckCircle className="w-3.5 h-3.5" />
              {language === "te" ? "ప్రభుత్వ డిజిటల్ ప్రమాణాలకు అనుకూలమైనది" : "Government Digital Standards Compliant"}
            </div>
          </div>

          {/* Quick Contacts */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider font-display">
              {language === "te" ? "పరిపాలనా హెల్ప్‌డెస్క్" : "Administrative Helpdesk"}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gov-400 mt-0.5 shrink-0" />
                <span>{t("office_address_val")}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gov-400 shrink-0" />
                <a href="tel:9573930799" className="hover:text-white transition font-mono">
                  +91-9573930799
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gov-400 shrink-0" />
                <a href="mailto:vendra.panchayat@ap.gov.in" className="hover:text-white transition font-mono">
                  vendra.panchayat@ap.gov.in
                </a>
              </li>
            </ul>
          </div>

          {/* Dynamic Information Portals links for reference */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider font-display">
              {language === "te" ? "ప్రభుత్వ లింకులు" : "Department Links"}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="https://ysrpensionkanuka.ap.gov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition cursor-pointer">
                  {language === "te" ? "YSR పెన్షన్ కానుక పోర్టల్" : "YSR Pension Kanuka Portal"}
                </a>
              </li>
              <li>
                <a href="https://onlineap.meeseva.gov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition cursor-pointer">
                  {language === "te" ? "AP మీసేవ సిటిజన్ పోర్టల్" : "AP Meeseva Citizens Portal"}
                </a>
              </li>
              <li>
                <a href="https://vsws.ap.gov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition cursor-pointer">
                  {language === "te" ? "గ్రామ వార్డు సచివాలయం" : "Gramaward Sachivalayam"}
                </a>
              </li>
              <li>
                <a href="https://apagri.ap.gov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition cursor-pointer">
                  {language === "te" ? "ఆంధ్రప్రదేశ్ వ్యవసాయ శాఖ" : "AP Agriculture Department"}
                </a>
              </li>
            </ul>
          </div>

          {/* Vision Statement */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider font-display">
              {language === "te" ? "మా ఆశయం" : "Our Vision"}
            </h4>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              {language === "te"
                ? "వేండ్ర గ్రామంలోని 3,115 మంది పౌరులకు 100% పారదర్శకతతో సంక్షేమ పథకాలు, మౌలిక సదుపాయాలు మరియు ప్రాథమిక డిజిటల్ సాధికారతను సకాలంలో అందించడం."
                : "To deliver proactive, digital, transparent, and prompt public administration to the 3,115 residents of Vendra, ensuring comprehensive welfare, robust infrastructure, and digital empowerment."}
            </p>
          </div>
        </div>

        <hr className="border-slate-800 my-8" />

        {/* Bottom copyright / disclaimer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-slate-500 font-sans">
          <p>© {currentYear} {t("portal_title")}. {language === "te" ? "సర్వ హక్కులూ ప్రత్యేకించబడినవి." : "All Rights Reserved."}</p>
          <div className="flex gap-6">
            <span className="hover:text-slate-400 transition cursor-pointer">{language === "te" ? "నిబంధనలు & షరతులు" : "Terms & Conditions"}</span>
            <span className="hover:text-slate-400 transition cursor-pointer">{language === "te" ? "గోప్యతా విధానం" : "Privacy Policy"}</span>
            <span className="hover:text-slate-400 transition cursor-pointer">{language === "te" ? "సైట్ మ్యాప్" : "Sitemap"}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
