/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { useTheme } from "./ThemeContext";
import { useLanguage } from "./LanguageContext";
import { Sun, Moon, Menu, X, Landmark, ShieldAlert, Award, Languages } from "lucide-react";

interface NavbarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  isAdminLoggedIn: boolean;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activePage, setActivePage, isAdminLoggedIn, onLogout }) => {
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
      // For localizing the calendar text, use respective locale
      const locale = language === "te" ? "te-IN" : "en-US";
      setDateTimeStr(now.toLocaleString(locale, options));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, [language]);

  const navItems = [
    { id: "home", key: "nav_home" },
    { id: "about", key: "nav_about" },
    { id: "admin-details", key: "nav_admin" },
    { id: "staff", key: "nav_staff" },
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

  return (
    <header className="sticky top-0 z-50 w-full bg-white/85 dark:bg-slate-950/85 backdrop-blur-md border-b border-slate-205 dark:border-slate-800/80 shadow-sm transition-all duration-300">
      {/* Top Info Bar */}
      <div className="bg-slate-50/90 dark:bg-slate-900/40 border-b border-slate-200/20 py-1.5 px-4 text-xs font-mono font-medium text-slate-500 dark:text-slate-400 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-[11px] text-gov-700 dark:text-gov-400 font-sans tracking-wide font-semibold">
            <Award className="w-3.5 h-3.5" />
            {t("navbar_tagline")}
          </span>
          <span className="hidden md:inline text-slate-300 dark:text-slate-700">|</span>
          <span className="hidden md:inline hover:text-gov-600 transition text-[11px]">
            {language === "te" ? "పెదపూడి మండలం, కాకినాడ జిల్లా" : "Pedapudi Mandal, Kakinada District"}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[11px] font-semibold">{dateTimeStr}</span>
          {isAdminLoggedIn && (
            <span className="bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded text-[10px] font-sans font-bold flex items-center gap-1">
              <ShieldAlert className="w-3" />
              {t("admin_active")}
            </span>
          )}
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo Brand */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => handleNavClick("home")}>
            <div className="relative flex items-center justify-center p-2.5 rounded-xl bg-gradient-to-br from-gov-600 to-gov-800 text-white shadow-md shadow-gov-600/15">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-display font-black text-slate-900 dark:text-white leading-none tracking-tight">
                {t("portal_title")}
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5 tracking-wider uppercase font-sans">
                {t("portal_subtitle")}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-2.5 py-2 rounded-lg text-xs xl:text-sm font-semibold transition-all duration-200 border border-transparent cursor-pointer ${
                  activePage === item.id
                    ? "bg-gov-50/80 dark:bg-slate-900 text-gov-800 dark:text-gov-400 border-gov-100 dark:border-slate-800 shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900/40"
                }`}
              >
                {t(item.key)}
              </button>
            ))}

            <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2" />

            <div className="flex items-center gap-2.5">
              {/* Language Selector Pills */}
              <div className="flex bg-slate-100 dark:bg-slate-900 rounded-lg p-0.5 border border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setLanguage("en")}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-md cursor-pointer transition ${
                    language === "en"
                      ? "bg-white dark:bg-slate-800 text-gov-700 dark:text-gov-400 shadow-sm"
                      : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                  title="Switch to English"
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
                  title="తెలుగులోకి మార్చండి"
                >
                  తె
                </button>
              </div>

              {/* Theme Toggle Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-250 dark:border-slate-850 cursor-pointer transition"
                title={theme === "dark" ? t("theme_light") : t("theme_dark")}
              >
                {theme === "dark" ? <Sun className="w-4 h-4 text-emerald-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
              </button>

              {/* Admin Dashboard / Logout Button */}
              {isAdminLoggedIn ? (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleNavClick("admin")}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                      activePage === "admin"
                        ? "bg-amber-100 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900"
                        : "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    {t("badge_admin_dashboard")}
                  </button>
                  <button
                    onClick={onLogout}
                    className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg cursor-pointer transition shadow-sm"
                  >
                    {t("logout")}
                  </button>
                </div>
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
          </nav>

          {/* Mobile Buttons Controls */}
          <div className="flex items-center lg:hidden gap-2">
            {/* Language Selection Quick Toggle */}
            <button
              onClick={() => setLanguage(language === "en" ? "te" : "en")}
              className="p-1.5 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{language === "en" ? "తె" : "EN"}</span>
            </button>

            {/* Mobile Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-emerald-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Drawer trigger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200/50 dark:border-slate-800/50 text-slate-600 dark:text-slate-300 transition cursor-pointer"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isOpen && (
        <div className="lg:hidden border-t border-slate-200/50 dark:border-slate-800/50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg transition-all duration-300 py-4 px-4 shadow-xl">
          <div className="flex flex-col gap-2.5">
            {navItems.map((item) => (
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

            <div className="h-[1px] bg-slate-100 dark:bg-slate-900 my-2" />

            {isAdminLoggedIn ? (
              <div className="flex flex-col gap-2.5 pt-1">
                <button
                  onClick={() => {
                    handleNavClick("admin");
                    setIsOpen(false);
                  }}
                  className="w-full text-center py-2.5 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 rounded-xl font-bold border border-amber-200/70 text-sm cursor-pointer"
                >
                  {t("badge_admin_dashboard")}
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setIsOpen(false);
                  }}
                  className="w-full text-center py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-sm cursor-pointer"
                >
                  {t("logout")}
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  handleNavClick("admin");
                  setIsOpen(false);
                }}
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
