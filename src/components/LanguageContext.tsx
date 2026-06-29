/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, translations } from "../translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("vendra-portal-language");
    return (saved as Language) === "te" ? "te" : "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("vendra-portal-language", lang);
  };

  const t = (key: string): string => {
    try {
      const translationSet = translations[language] || translations["en"];
      let val = (translationSet as any)[key];
      
      if (val === undefined) {
        const fallbackSet = translations["en"];
        val = (fallbackSet as any)[key];
      }
      if (val === undefined) return key;

      // Automatically replace hardcoded Vendra/Pedapudi/Kakinada with selected village
      if (typeof val === 'string') {
        try {
          const sv = localStorage.getItem("csp-selected-village");
          if (sv) {
            const village = JSON.parse(sv);
            val = val.replace(/Vendra/gi, language === 'te' && village.nameTe ? village.nameTe : village.name);
            val = val.replace(/వేండ్ర/g, village.nameTe || village.name);
            
            if (village.mandal) {
               val = val.replace(/Pedapudi/gi, language === 'te' && village.mandalTe ? village.mandalTe : village.mandal);
               val = val.replace(/పెదపూడి/g, village.mandalTe || village.mandal);
            }
            if (village.district) {
               val = val.replace(/Kakinada/gi, language === 'te' && village.districtTe ? village.districtTe : village.district);
               val = val.replace(/కాకినాడ/g, village.districtTe || village.district);
            }
            if (village.type === "Municipality") {
               val = val.replace(/Gram Panchayat/gi, language === 'te' ? 'మున్సిపాలిటీ' : 'Municipality');
               val = val.replace(/Panchayat/gi, language === 'te' ? 'మున్సిపాలిటీ' : 'Municipality');
               val = val.replace(/గ్రామ పంచాయతీ/g, 'మున్సిపాలిటీ');
               val = val.replace(/పంచాయతీ/g, 'మున్సిపాలిటీ');
            }
          }
        } catch(e) {}
      }
      return val;
    } catch (err) {
      return key;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
