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
      const val = (translationSet as any)[key];
      if (val !== undefined) return val;

      // Fallback to English if translation isn't available
      const fallbackSet = translations["en"];
      const fallbackVal = (fallbackSet as any)[key];
      if (fallbackVal !== undefined) return fallbackVal;

      return key; // Returns raw key if missing entirely
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
