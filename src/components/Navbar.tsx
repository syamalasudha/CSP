/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { useTheme } from "./ThemeContext";
import { useLanguage } from "./LanguageContext";
import {
  Sun, Moon, Menu, X, Landmark, ShieldAlert, Award,
  Languages, ArrowLeftRight, ChevronDown
} from "lucide-react";
import { VillageInfo } from "./VillageSelector";

interface NavbarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  isAdminLoggedIn: boolean;
  onLogout: () => void;
  selectedVillage: VillageInfo;
  onSwitchVillage: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  setActivePage,
  isAdminLoggedIn,
  onLogout,
  selectedVillage,
  onSwitchVillage,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [dateTimeStr, setDateTimeStr] = useState("");


  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      const locale = language === "te" ? "te-IN" : "en-US";
      setDateTimeStr(now.toLocaleString(locale, options));
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, [language]);

  const allNavItems = [
    { id: "home", key: "nav_home" },
    { id: "about", key: "nav_about" },
    { id: "admin-details", key: "nav_admin" },
    { id: "staff", key: "nav_staff" },
    { id: "citizen-services", key: "nav_services" },
    { id: "agriculture", key: "nav_agriculture" },
    { id: "welfare", key: "nav_welfare" },
    { id: "voters", key: "nav_voters" },
    { id: "gallery", key: "nav_gallery" },
    { id: "contact", key: "nav_contact" },
  ];

  const handleNavClick = (id: string) => {
    setActivePage(id);
    window.location.hash = id;
    setIsOpen(false);
  };

  const villageName = language === "te" ? selectedVillage.nameTe : selectedVillage.name;
  const mandalName = language === "te" ? selectedVillage.mandalTe : selectedVillage.mandal;

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-slate-950/95 backdrop-blur-md shadow-sm border-b border-slate-200 dark:border-slate-800/80 transition-all duration-300">

      {/* ── TOP STRIP: tagline + datetime + admin badge ── */}
      <div className="bg-slate-50/90 dark:bg-slate-900/50 border-b border-slate-200/50 dark:border-slate-800/50 py-1 px-4 text-[11px] font-mono text-slate-500 dark:text-slate-400 flex flex-wrap justify-between items-center gap-2">
        <span className="flex items-center gap-1.5 text-gov-700 dark:text-gov-400 font-sans font-semibold">
          <Award className="w-3.5 h-3.5" />
          {t("navbar_tagline")}
        </span>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline font-semibold">{dateTimeStr}</span>
          {isAdminLoggedIn && (
            <div className="flex items-center gap-2">
              <span className="bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded text-[10px] font-sans font-bold flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" />
                {t("admin_active")}
              </span>
              <button
                onClick={onLogout}
                className="px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-sans font-bold rounded-md transition"
              >
                {t("logout")}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── ROW 1: Logo + Utility Controls ── */}
      <div className="px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14 md:h-16 border-b border-slate-100 dark:border-slate-800/60">

        {/* Logo */}
        <button
          onClick={() => handleNavClick("home")}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="flex items-center justify-center p-2 rounded-xl bg-gradient-to-br from-gov-600 to-gov-800 text-white shadow-md shadow-gov-600/20 group-hover:shadow-gov-600/30 transition-shadow">
            <Landmark className="w-5 h-5" />
          </div>
          <div className="text-left">
            <p className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-none tracking-tight font-display">
              {t("portal_title")}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 tracking-wider uppercase">
              {mandalName} · {t("portal_subtitle")}
            </p>
          </div>
        </button>

        {/* Desktop utility controls */}
        <div className="hidden lg:flex items-center gap-2">
          {/* Switch village */}
          <button
            onClick={onSwitchVillage}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-gov-700 dark:hover:text-gov-400 hover:border-gov-200 dark:hover:border-gov-900 transition cursor-pointer"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            {language === "te" ? "మార్చు" : "Switch"}
          </button>

          {/* Language toggle */}
          <div className="flex bg-slate-100 dark:bg-slate-900 rounded-lg p-0.5 border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setLanguage("en")}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-md cursor-pointer transition ${
                language === "en"
                  ? "bg-white dark:bg-slate-800 text-gov-700 dark:text-gov-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("te")}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-md cursor-pointer transition ${
                language === "te"
                  ? "bg-white dark:bg-slate-800 text-gov-700 dark:text-gov-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              తె
            </button>
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 cursor-pointer transition"
            title={theme === "dark" ? t("theme_light") : t("theme_dark")}
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-emerald-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Admin button */}
          {isAdminLoggedIn ? (
            <button
              onClick={() => handleNavClick("admin")}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                activePage === "admin"
                  ? "bg-amber-100 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900"
                  : "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
              }`}
            >
              {t("badge_admin_dashboard")}
            </button>
          ) : (
            <button
              onClick={() => handleNavClick("admin")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer transition ${
                activePage === "admin"
                  ? "bg-gov-600 text-white border-transparent"
                  : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/60"
              }`}
            >
              {t("admin_login")}
            </button>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex items-center lg:hidden gap-2">
          <button
            onClick={() => setLanguage(language === "en" ? "te" : "en")}
            className="p-1.5 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{language === "en" ? "తె" : "EN"}</span>
          </button>
          <button
            onClick={toggleTheme}
            className="p-1.5 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-emerald-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200/50 dark:border-slate-800/50 text-slate-600 dark:text-slate-300 transition cursor-pointer"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── ROW 2: Nav links (desktop only) ── */}
      <div className="hidden lg:block px-4 sm:px-6 lg:px-8 bg-white/80 dark:bg-slate-950/80">
        <nav className="flex items-center justify-between h-10">
          {allNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`relative px-2.5 py-1.5 rounded-md text-[12px] font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap flex-1 text-center
                ${activePage === item.id
                  ? "text-gov-700 dark:text-gov-400 bg-gov-50 dark:bg-slate-900"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900/50"
                }`}
            >
              {t(item.key)}
              {activePage === item.id && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gov-600 dark:bg-gov-400 rounded-full" />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* ── Mobile Drawer ── */}
      {isOpen && (
        <div className="lg:hidden border-t border-slate-200/50 dark:border-slate-800/50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg py-4 px-4 shadow-xl">
          <div className="flex flex-col gap-1.5">
            {allNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition ${
                  activePage === item.id
                    ? "bg-gov-50 dark:bg-slate-900 text-gov-800 dark:text-gov-400 font-bold border-l-4 border-gov-600 pl-3"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/40"
                }`}
              >
                {t(item.key)}
              </button>
            ))}

            <div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />

            <button
              onClick={() => { onSwitchVillage(); setIsOpen(false); }}
              className="w-full text-center py-2.5 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-xl font-semibold border border-slate-200 dark:border-slate-800 text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeftRight className="w-4 h-4" />
              {language === "te" ? "గ్రామం మార్చు" : "Switch Village"}
            </button>

            {isAdminLoggedIn ? (
              <div className="flex flex-col gap-2 pt-1">
                <button
                  onClick={() => handleNavClick("admin")}
                  className="w-full text-center py-2.5 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 rounded-xl font-bold border border-amber-200/70 text-sm cursor-pointer"
                >
                  {t("badge_admin_dashboard")}
                </button>
                <button
                  onClick={() => { onLogout(); setIsOpen(false); }}
                  className="w-full text-center py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-sm cursor-pointer"
                >
                  {t("logout")}
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavClick("admin")}
                className="w-full text-center py-2.5 bg-gov-600 text-white rounded-xl font-bold text-sm shadow-sm shadow-gov-600/10 cursor-pointer"
              >
                {t("admin_login")}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};