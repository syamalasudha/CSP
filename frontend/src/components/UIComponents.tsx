/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

// --- ANIMATED COUNTER ---
export const AnimatedCounter: React.FC<{
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimal?: boolean;
}> = ({ end, duration = 1200, suffix = "", prefix = "", decimal = false }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(progress * end);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  const formattedCount = decimal
    ? count.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : Math.floor(count).toLocaleString();

  return (
    <span className="font-display font-bold tabular-nums">
      {prefix}
      {formattedCount}
      {suffix}
    </span>
  );
};

// --- GLASS CARDS ---
export const GlassCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  id?: string;
}> = ({ children, className = "", hoverEffect = true, id }) => {
  return (
    <div
      id={id}
      className={`bg-white/70 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/40 rounded-2xl p-6 shadow-sm shadow-slate-100/50 dark:shadow-none transition-all duration-300 ${
        hoverEffect ? "hover:translate-y-[-2px] hover:shadow-md hover:border-gov-600/30 dark:hover:border-gov-600/30" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
};

// --- SECTION HEADER ---
export const SectionHeading: React.FC<{
  title: string;
  badge: string;
  subtitle?: string;
}> = ({ title, badge, subtitle }) => {
  return (
    <div className="mb-10 text-center">
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gov-100 text-gov-800 dark:bg-gov-950 dark:text-gov-50 border border-gov-600/15 mb-3 font-display uppercase tracking-widest">
        {badge}
      </span>
      <h2 className="text-3xl md:text-4xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-sans">
          {subtitle}
        </p>
      )}
      <div className="w-16 h-1 bg-gov-600 mx-auto mt-4 rounded-full" />
    </div>
  );
};

// --- TOAST NOTIFICATIONS TYPE AND COMPONENT ---
export interface Toast {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

export const ToastContainer: React.FC<{
  toasts: Toast[];
  removeToast: (id: string) => void;
}> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 max-w-md w-full">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-start gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-md transform transition-all duration-300 animate-slide-in ${
            t.type === "success"
              ? "bg-emerald-50/95 dark:bg-emerald-950/90 text-emerald-800 dark:text-emerald-100 border-emerald-200/50 dark:border-emerald-900/50"
              : t.type === "error"
              ? "bg-rose-50/95 dark:bg-rose-950/90 text-rose-800 dark:text-rose-100 border-rose-200/50 dark:border-rose-900/50"
              : "bg-gov-50/95 dark:bg-gov-950/90 text-gov-800 dark:text-gov-50 border-gov-100 dark:border-gov-900/50"
          }`}
        >
          <div className="mt-0.5 shrink-0">
            {t.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
            {t.type === "error" && <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />}
            {t.type === "info" && <Info className="w-5 h-5 text-gov-600 dark:text-gov-400" />}
          </div>
          <p className="text-sm font-medium leading-tight flex-1">{t.message}</p>
          <button
            onClick={() => removeToast(t.id)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 shrink-0 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

// --- DYNAMIC EMBEDDED MAP COMPONENT ---
export const VillageMapShadowbox: React.FC<{ locationQuery?: string }> = ({ locationQuery }) => {
  const query = locationQuery ? encodeURIComponent(locationQuery) : "Andhra+Pradesh";
  const mapSrc = `https://maps.google.com/maps?q=${query}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
  
  return (
    <div className="relative rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 h-80 bg-slate-100 dark:bg-slate-900">
      {/* Real embed map of the selected region */}
      <iframe
        title="Village Location Map"
        src={mapSrc}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen={false}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="opacity-90 hover:opacity-100 transition-opacity duration-300"
      ></iframe>
    </div>
  );
};
