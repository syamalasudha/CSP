/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { GlassCard } from "./UIComponents";

// --- VILLAGE VOTERS CASTE/GENDER DONUT CHART ---
interface VoterDonutProps {
  male: number;
  female: number;
  bc: number;
  sc: number;
  st: number;
}

export const VoterDistributionDonut: React.FC<VoterDonutProps> = ({ male, female, bc, sc, st }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const totalGender = male + female;
  const categories = [
    { name: "Male Voters", value: male, color: "bg-gov-600", stroke: "#059669" },
    { name: "Female Voters", value: female, color: "bg-emerald-400", stroke: "#34d399" },
    { name: "SC Voters", value: sc, color: "bg-teal-500", stroke: "#14b8a6" },
    { name: "BC Voters", value: bc, color: "bg-cyan-500", stroke: "#06b6d4" },
    { name: "ST Voters", value: st, color: "bg-emerald-700", stroke: "#047857" },
  ];

  const total = male + female + bc + sc + st;

  // Simple clean SVG calculations
  const radius = 60;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  let accumulatedAngle = 0;

  return (
    <GlassCard className="h-full flex flex-col justify-between">
      <div>
        <h3 className="text-base font-display font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-1">
          Voter Demographics
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          {`Distribution statistics across ${total} registered voters`}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 items-center">
        {/* SVG Circle visualizer */}
        <div className="relative flex justify-center items-center h-48">
          <svg width="180" height="180" viewBox="0 0 180 180" className="transform -rotate-90">
            <circle cx="90" cy="90" r={radius} fill="transparent" stroke="#f1f5f9" strokeWidth={strokeWidth} className="dark:stroke-slate-800" />
            {categories.map((cat, i) => {
              const fraction = cat.value / total;
              const strokeDasharray = `${fraction * circumference} ${circumference}`;
              const strokeDashoffset = -accumulatedAngle;
              accumulatedAngle += fraction * circumference;
              const isHovered = hoveredIndex === i;

              return (
                <circle
                  key={cat.name}
                  cx="90"
                  cy="90"
                  r={radius}
                  fill="transparent"
                  stroke={cat.stroke}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              );
            })}
          </svg>

          {/* Central tooltip */}
          <div className="absolute flex flex-col items-center text-center">
            <span className="text-2xl font-display font-black text-slate-800 dark:text-white">
              {hoveredIndex !== null ? categories[hoveredIndex].value : total}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">
              {hoveredIndex !== null ? categories[hoveredIndex].name : "Total Voters"}
            </span>
          </div>
        </div>

        {/* Legend list */}
        <div className="space-y-2.5">
          {categories.map((cat, i) => {
            const perc = total > 0 ? ((cat.value / total) * 100).toFixed(1) : "0.0";
            return (
              <div
                key={cat.name}
                className={`flex justify-between items-center p-2 rounded-lg transition-colors cursor-pointer ${
                  hoveredIndex === i ? "bg-slate-50 dark:bg-slate-900/50" : ""
                }`}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${cat.color} shrink-0`} />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {cat.name}
                  </span>
                </div>
                  <span className="text-xs font-mono font-bold text-slate-900 dark:text-white text-right">
                    {cat.value} <span className="text-[10px] text-slate-400">({perc}%)</span>
                  </span>
              </div>
            );
          })}
        </div>
      </div>
    </GlassCard>
  );
};

// --- LAND SURVEY CATEGORY BAR GRAPH ---
interface LandBarProps {
  wet: number;
  dry: number;
  publicCommon: number;
  fisheries: number;
  assigned: number;
  endowments: number;
  total: number;
}

export const LandAllocationAcreBar: React.FC<LandBarProps> = ({
  wet,
  dry,
  publicCommon,
  fisheries,
  assigned,
  endowments,
  total,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const landRows = [
    { label: "Wet Cultivated Land", value: wet, color: "bg-emerald-500", rawColor: "#10b981", desc: "Rice paddy and sugar cane fields" },
    { label: "Public Commons", value: publicCommon, color: "bg-blue-500", rawColor: "#3b82f6", desc: "Common grazing ground, village pathways" },
    { label: "Endowments Land", value: endowments, color: "bg-amber-500", rawColor: "#f59e0b", desc: "Temple and local trust holdings" },
    { label: "Fisheries (Water Ponds)", value: fisheries, color: "bg-sky-400", rawColor: "#38bdf8", desc: "Freshwater aquaculture leases" },
    { label: "Assigned Lands", value: assigned, color: "bg-indigo-500", rawColor: "#6366f1", desc: "Distributed to landless SC/ST families" },
    { label: "Dry Uplands Land", value: dry, color: "bg-amber-700", rawColor: "#b45309", desc: "Coarse grain / non-irrigated dry fields" },
  ];

  return (
    <GlassCard className="h-full flex flex-col justify-between">
      <div>
        <h3 className="text-base font-display font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-1">
          Land Classification
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Acreage allocation of the Gram Panchayat out of {total} Acres
        </p>
      </div>

      <div className="space-y-4">
        {landRows.map((row, index) => {
          const percentage = ((row.value / total) * 100).toFixed(1);
          const isHovered = hoveredIndex === index;

          return (
            <div
              key={row.label}
              className="space-y-1"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="flex justify-between items-end text-xs font-medium">
                <div>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold">{row.label}</span>
                  {isHovered && (
                    <span className="block text-[10px] text-slate-400 transition-all leading-tight mt-0.5">
                      {row.desc}
                    </span>
                  )}
                </div>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {row.value} Ac <span className="text-[10px] text-slate-400">({percentage}%)</span>
                </span>
              </div>

              {/* Progress bar line */}
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative cursor-pointer">
                <div
                  className={`h-full ${row.color} rounded-full transition-all duration-500 ${
                    isHovered ? "brightness-105" : ""
                  }`}
                  style={{ width: `${Math.max(Number(percentage), 1.5)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};

// --- PENSIONS VALUE SEGMENTS VERTICAL HISTOGRAM ---
interface PensionsProps {
  oap: number;
  disabled: number;
  widow: number;
  tTappers: number;
  singleWomen: number;
  dmho: number;
  artists: number;
  abh: number;
  cobbler: number;
  total: number;
}

export const PensionStructureBar: React.FC<PensionsProps> = ({
  oap,
  disabled,
  widow,
  tTappers,
  singleWomen,
  dmho,
  artists,
  abh,
  cobbler,
  total,
}) => {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const pensionBlocks = [
    { label: "OAP (Old Age)", count: oap, color: "bg-emerald-500" },
    { label: "Widow Pension", count: widow, color: "bg-teal-500" },
    { label: "Senior Artists", count: artists, color: "bg-indigo-500" },
    { label: "Disabled", count: disabled, color: "bg-rose-500" },
    { label: "ABH Group", count: abh, color: "bg-sky-400" },
    { label: "Toddy Tappers", count: tTappers, color: "bg-amber-600" },
    { label: "Cobblers", count: cobbler, color: "bg-orange-500" },
    { label: "DMHO Health", count: dmho, color: "bg-blue-500" },
    { label: "Single Women", count: singleWomen, color: "bg-pink-500" },
  ];

  const maxVal = Math.max(...pensionBlocks.map((b) => b.count));

  return (
    <GlassCard className="h-full">
      <div className="mb-6">
        <h3 className="text-base font-display font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-1">
          Welfare Beneficiaries
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          State pension distribution segments covering all {total} active beneficiaries in the village
        </p>
      </div>

      {/* Grid structure charting */}
      <div className="flex flex-col md:flex-row gap-6 items-center">
        {/* Interactive Bar Pillars */}
        <div className="flex-1 w-full h-56 flex items-end justify-between gap-1.5 sm:gap-3 bg-slate-50/50 dark:bg-slate-900/20 p-4 border border-slate-100 dark:border-slate-800/20 rounded-xl relative">
          {pensionBlocks.map((block, index) => {
            const heightPerc = ((block.count / maxVal) * 100).toFixed(1);
            const isHovered = hoveredBar === index;

            return (
              <div
                key={block.label}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                onMouseEnter={() => setHoveredBar(index)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                {/* Floating tooltip */}
                <div
                  className={`absolute top-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white rounded-lg px-2.5 py-1 text-[11px] font-semibold flex items-center gap-2 shadow-md transition-all duration-200 ${
                    isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                  }`}
                >
                  <span className="font-display font-bold text-emerald-400 leading-none">{block.count} Cards</span>
                  <span className="text-slate-400 text-[10px]">({block.label})</span>
                </div>

                {/* Animated bar columns */}
                <div
                  className={`w-full ${block.color} rounded-t-md transition-all duration-500 ${
                    isHovered ? "brightness-110 shadow-lg" : "brightness-95 opacity-80"
                  }`}
                  style={{ height: `${Math.max(Number(heightPerc), 6)}%` }}
                />

                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-1 w-full truncate text-center">
                  {block.count}
                </span>
              </div>
            );
          })}
        </div>

        {/* Labels legend listing */}
        <div className="w-full md:w-56 grid grid-cols-2 md:grid-cols-1 gap-2 shrink-0">
          {pensionBlocks.map((block, i) => (
            <div
              key={block.label}
              className={`flex items-center gap-2 p-1.5 rounded-lg text-xs leading-none transition-colors border border-transparent ${
                hoveredBar === i ? "bg-slate-100 dark:bg-slate-900/50 border-slate-200/50 dark:border-slate-800/50" : ""
              }`}
              onMouseEnter={() => setHoveredBar(i)}
              onMouseLeave={() => setHoveredBar(null)}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${block.color} shrink-0`} />
              <span className="text-slate-600 dark:text-slate-400 truncate max-w-[100px] sm:max-w-none md:max-w-[140px]">
                {block.label}
              </span>
              <span className="ml-auto font-mono font-bold text-slate-950 dark:text-white">
                {block.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
};
