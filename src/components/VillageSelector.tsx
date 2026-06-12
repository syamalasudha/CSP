/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Landmark, MapPin, Users, ChevronDown, ArrowRight } from "lucide-react";

export interface VillageInfo {
  id: string;
  name: string;
  nameTe: string;
  mandal: string;
  mandalTe: string;
  district: string;
  districtTe: string;
  population: string;
  wards: string;
  color: string;
  accent: string;
}

const DEFAULT_COLORS = [
  "from-emerald-600 to-teal-700",
  "from-blue-600 to-indigo-700",
  "from-violet-600 to-purple-700",
  "from-amber-600 to-orange-700",
];

interface VillageSelectorProps {
  onSelect: (village: VillageInfo) => void;
}

export const VillageSelector: React.FC<VillageSelectorProps> = ({ onSelect }) => {
  const [language, setLanguage] = useState<"en" | "te">("en");
  const [villages, setVillages] = useState<VillageInfo[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch("/db.json");
        if (!res.ok) throw new Error("Could not load villages");
        const json = await res.json();
        const raw: any[] = json.villages || [];
        const mapped: VillageInfo[] = raw.map((r, idx) => ({
          id: r.id || `village-${idx + 1}`,
          name: r.name || `Village ${idx + 1}`,
          nameTe: r.nameTe || "",
          mandal: r.mandal || "",
          mandalTe: r.mandalTe || "",
          district: r.district || "",
          districtTe: r.districtTe || "",
          population: r.stats && r.stats.population ? String(r.stats.population) : "—",
          wards: r.stats && r.stats.totalWards ? String(r.stats.totalWards) : "—",
          color: DEFAULT_COLORS[idx % DEFAULT_COLORS.length],
          accent: "emerald",
        }));
        setVillages(mapped);
      } catch (err) {
        setVillages(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const selected = villages?.find((v) => v.id === selectedId) ?? null;

  // Only the first village has data; others are "coming soon"
  const isAvailable = (idx: number) => idx === 0;

  const handleProceed = () => {
    if (selected) onSelect(selected);
  };

  if (loading || !villages) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center text-slate-400">Loading villages…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Top strip */}
      <div className="border-b border-slate-800/60 bg-slate-900/60 py-2 px-6 flex items-center justify-between text-xs text-slate-400 font-mono">
        <span className="flex items-center gap-2 text-emerald-400 font-semibold">
          <Landmark className="w-3.5 h-3.5" />
          {language === "te"
            ? "ఆంధ్రప్రదేశ్ డిజిటల్ గ్రామ సచివాలయ పోర్టల్"
            : "Andhra Pradesh Digital Gram Panchayat Portal"}
        </span>
        <div className="flex gap-1 bg-slate-800 rounded-md p-0.5">
          <button
            onClick={() => setLanguage("en")}
            className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition cursor-pointer ${
              language === "en" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage("te")}
            className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition cursor-pointer ${
              language === "te" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            తె
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        {/* Header */}
        <div className="text-center mb-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 shadow-2xl shadow-emerald-600/20 mb-2">
            <Landmark className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            {language === "te" ? "గ్రామ పంచాయతీ పోర్టల్" : "Gram Panchayat Portal"}
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            {language === "te"
              ? "కొనసాగడానికి మీ గ్రామాన్ని ఎంచుకోండి"
              : "Select your village to continue to the digital portal"}
          </p>
        </div>

        {/* Select box */}
        <div className="w-full max-w-md space-y-4">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">
            {language === "te" ? "గ్రామం ఎంచుకోండి" : "Select Village"}
          </label>

          {/* Custom dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpen((o) => !o)}
              className="w-full flex items-center justify-between gap-3 bg-slate-900 border border-slate-700 hover:border-emerald-600/60 rounded-xl px-4 py-3.5 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/50"
            >
              {selected ? (
                <span className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-br ${selected.color} flex-shrink-0`} />
                  <span className="font-semibold text-white">
                    {language === "te" ? selected.nameTe : selected.name}
                  </span>
                  <span className="text-slate-500 text-sm">
                    — {language === "te" ? selected.mandalTe : selected.mandal}
                  </span>
                </span>
              ) : (
                <span className="text-slate-500">
                  {language === "te" ? "గ్రామాన్ని ఎంచుకోండి..." : "Choose a village..."}
                </span>
              )}
              <ChevronDown
                className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown options */}
            {open && (
              <div className="absolute z-20 mt-2 w-full bg-slate-900 border border-slate-700 rounded-xl shadow-2xl shadow-black/40 overflow-hidden">
                {villages.map((v, idx) => {
                  const available = isAvailable(idx);
                  return (
                    <button
                      key={v.id}
                      disabled={!available}
                      onClick={() => {
                        if (available) {
                          setSelectedId(v.id);
                          setOpen(false);
                        }
                      }}
                      className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-left transition-colors duration-150
                        ${available
                          ? "hover:bg-slate-800 cursor-pointer"
                          : "opacity-50 cursor-not-allowed"
                        }
                        ${selectedId === v.id ? "bg-slate-800" : ""}
                      `}
                    >
                      <span className="flex items-center gap-3 min-w-0">
                        <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-br ${v.color} flex-shrink-0 ${!available ? "grayscale" : ""}`} />
                        <span className="flex flex-col min-w-0">
                          <span className={`font-semibold text-sm ${available ? "text-white" : "text-slate-400"}`}>
                            {language === "te" ? v.nameTe || v.name : v.name}
                          </span>
                          {available && (
                            <span className="text-xs text-slate-500 truncate">
                              {language === "te" ? v.mandalTe : v.mandal}
                              {v.district ? `, ${language === "te" ? v.districtTe : v.district}` : ""}
                            </span>
                          )}
                        </span>
                      </span>
                      {!available && (
                        <span className="text-[10px] font-bold bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full uppercase tracking-wider flex-shrink-0">
                          {language === "te" ? "త్వరలో" : "Soon"}
                        </span>
                      )}
                      {selectedId === v.id && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Selected village info card */}
          {selected && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-5 text-sm text-slate-400">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-semibold text-slate-300">{selected.population}</span>
                {" "}{language === "te" ? "జనాభా" : "Population"}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-semibold text-slate-300">{selected.wards}</span>
                {" "}{language === "te" ? "వార్డులు" : "Wards"}
              </span>
            </div>
          )}

          {/* Proceed button */}
          <button
            onClick={handleProceed}
            disabled={!selected}
            className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all duration-200
              ${selected
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-600/20 cursor-pointer"
                : "bg-slate-800 text-slate-600 cursor-not-allowed"
              }`}
          >
            {language === "te" ? "పోర్టల్ తెరవండి" : "Open Portal"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Footer note */}
        <p className="mt-10 text-xs text-slate-600 text-center max-w-sm leading-relaxed">
          {language === "te"
            ? "మీరు లాగిన్ అయిన తర్వాత గ్రామాన్ని మార్చవచ్చు. ఇతర గ్రామ పోర్టల్స్ త్వరలో అందుబాటులో ఉంటాయి."
            : "You can switch village anytime after entering. Other village portals are being set up and will be available soon."}
        </p>
      </div>
    </div>
  );
};