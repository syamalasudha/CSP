/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { useLanguage } from "../components/LanguageContext";
import { GlassCard } from "../components/UIComponents";
import { apiUrl } from "../config/api";
import {
  DatabaseSchema,
  PortalUser,
  ContactMessage,
  CertificateItem,
  SchemeItem,
} from "../types";
import {
  UserCheck,
  LogIn,
  UserPlus,
  BookmarkCheck,
  MessageSquare,
  CheckCircle2,
  Clock,
  FileText,
  ShieldCheck,
  Loader2,
  Eye,
  EyeOff,
  ArrowRight,
  LogOut,
  Trash2,
} from "lucide-react";

interface CitizenPortalProps {
  data: DatabaseSchema;
  token: string | null;
  user: PortalUser | null;
  onLoginSuccess: (token: string, user: PortalUser) => void;
  onLogout: () => void;
  onToggleBookmark: (type: "certificate" | "scheme", itemId: string) => void;
  onNavigate: (page: string) => void;
  onToastSuccess: (msg: string) => void;
  onToastError: (msg: string) => void;
}

export const CitizenPortal: React.FC<CitizenPortalProps> = ({
  data,
  token,
  user,
  onLoginSuccess,
  onLogout,
  onToggleBookmark,
  onNavigate,
  onToastSuccess,
  onToastError,
}) => {
  const { language } = useLanguage();
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Login fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Register fields
  const [regForm, setRegForm] = useState({
    fullName: "",
    username: "",
    phone: "",
    email: "",
    ward: "",
    password: "",
  });

  // Citizen dashboard state
  const [myMessages, setMyMessages] = useState<ContactMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [schemes, setSchemes] = useState<SchemeItem[]>([]);

  useEffect(() => {
    if (!token || !user) return;
    fetchMyGrievances();
    fetchSavedServices();
  }, [token, data.id]);

  const fetchMyGrievances = async () => {
    if (!token) return;
    setLoadingMessages(true);
    try {
      const res = await fetch(apiUrl("/api/messages/mine"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const list = await res.json();
        setMyMessages(list || []);
      }
    } catch {
      // Ignore transient errors
    } finally {
      setLoadingMessages(false);
    }
  };

  const fetchSavedServices = async () => {
    try {
      const res = await fetch(apiUrl(`/api/services?villageId=${encodeURIComponent(data.id)}`));
      if (res.ok) {
        const json = await res.json();
        setCertificates(json.certificates || []);
        setSchemes(json.schemes || []);
      }
    } catch {
      // Ignore transient errors
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      onToastError(language === "te" ? "వినియోగదారు పేరు మరియు పాస్‌వర్డ్ అవసరం." : "Username and password are required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(apiUrl("/api/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, expectedRole: "citizen" }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json.error || "Login failed");
      }
      onLoginSuccess(json.token, json.user);
      onToastSuccess(
        language === "te"
          ? `స్వాగతం ${json.user.fullName}!`
          : `Welcome back, ${json.user.fullName}!`
      );
    } catch (err) {
      onToastError(err instanceof Error ? err.message : "Could not sign in.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.fullName || !regForm.username || !regForm.phone || !regForm.password) {
      onToastError(
        language === "te"
          ? "దయచేసి పేరు, యూజర్‌నేమ్, ఫోన్ మరియు పాస్‌వర్డ్ పూరించండి."
          : "Full name, username, phone, and password are required."
      );
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(apiUrl("/api/auth/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...regForm, villageId: data.id }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json.error || "Registration failed");
      }
      onLoginSuccess(json.token, json.user);
      onToastSuccess(
        language === "te"
          ? "పౌర ఖాతా విజయవంతంగా సృష్టించబడింది!"
          : "Citizen account registered successfully!"
      );
    } catch (err) {
      onToastError(err instanceof Error ? err.message : "Could not register account.");
    } finally {
      setLoading(false);
    }
  };

  // --- UNAUTHENTICATED VIEW (Login / Register) ---
  if (!token || !user) {
    return (
      <div className="max-w-lg mx-auto py-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 uppercase tracking-widest">
            <UserCheck className="w-3.5 h-3.5" />
            {language === "te" ? "పౌర సేవా ఖాతా" : "Citizen Portal Access"}
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-slate-900 dark:text-white">
            {language === "te" ? "గ్రామ పౌర లాగిన్ & నమోదు" : "Citizen Login & Registration"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {language === "te"
              ? "మీ అర్జీల స్థితిని ట్రాక్ చేయండి మరియు అవసరమైన పత్రాలు & పథకాల జాబితాను సేవ్ చేయండి."
              : "Track your lodged grievances, read official responses, and save required document checklists before visiting Sachivalayam."}
          </p>
        </div>

        <GlassCard hoverEffect={false} className="border-t-4 border-emerald-600 p-6 sm:p-8">
          {/* Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setAuthMode("login")}
              className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                authMode === "login"
                  ? "bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              {language === "te" ? "పౌర లాగిన్" : "Citizen Login"}
            </button>
            <button
              type="button"
              onClick={() => setAuthMode("register")}
              className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                authMode === "register"
                  ? "bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              {language === "te" ? "కొత్త ఖాతా నమోదు" : "New Registration"}
            </button>
          </div>

          {authMode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4 text-xs font-sans">
              <div className="space-y-1">
                <label className="font-bold text-slate-600 dark:text-slate-400 uppercase">
                  {language === "te" ? "వినియోగదారు పేరు" : "Username"}
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. citizen"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-600 dark:text-slate-400 uppercase">
                  {language === "te" ? "పాస్‌వర్డ్" : "Password"}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 pr-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition shadow flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (language === "te" ? "లాగిన్ అవ్వండి" : "Sign In as Citizen")}
              </button>

              <div className="pt-4 mt-4 border-t border-slate-200/60 dark:border-slate-800 text-center space-y-2">
                <p className="text-[11px] text-slate-400">
                  {language === "te" ? "డెమో పౌర ఖాతా:" : "Base Demo Citizen Login:"}{" "}
                  <span className="font-mono bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">
                    citizen
                  </span>{" "}
                  /{" "}
                  <span className="font-mono bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">
                    citizen123
                  </span>
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setUsername("citizen");
                    setPassword("citizen123");
                  }}
                  className="text-[11px] font-bold text-emerald-600 hover:underline cursor-pointer"
                >
                  {language === "te" ? "డెమో వివరాలు నింపండి" : "Fill Demo Citizen Credentials"}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3.5 text-xs font-sans">
              <div className="space-y-1">
                <label className="font-bold text-slate-600 dark:text-slate-400 uppercase">
                  {language === "te" ? "పూర్తి పేరు" : "Full Name"} *
                </label>
                <input
                  type="text"
                  required
                  value={regForm.fullName}
                  onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-600 dark:text-slate-400 uppercase">
                    {language === "te" ? "వినియోగదారు పేరు" : "Username"} *
                  </label>
                  <input
                    type="text"
                    required
                    value={regForm.username}
                    onChange={(e) => setRegForm({ ...regForm, username: e.target.value })}
                    placeholder="e.g. ramesh_w4"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-600 dark:text-slate-400 uppercase">
                    {language === "te" ? "మొబైల్ నంబర్" : "Phone Number"} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={regForm.phone}
                    onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                    placeholder="9849xxxxxx"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-600 dark:text-slate-400 uppercase">
                    {language === "te" ? "వార్డు నంబర్ (ఐచ్ఛికం)" : "Ward Number (Optional)"}
                  </label>
                  <input
                    type="text"
                    value={regForm.ward}
                    onChange={(e) => setRegForm({ ...regForm, ward: e.target.value })}
                    placeholder="e.g. 4"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-600 dark:text-slate-400 uppercase">
                    {language === "te" ? "ఇమెయిల్ (ఐచ్ఛికం)" : "Email (Optional)"}
                  </label>
                  <input
                    type="email"
                    value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                    placeholder="citizen@example.com"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-600 dark:text-slate-400 uppercase">
                  {language === "te" ? "పాస్‌వర్డ్ (కనీసం 6 అక్షరాలు)" : "Password (min 6 chars)"} *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={regForm.password}
                  onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition shadow flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (language === "te" ? "ఖాతా సృష్టించండి" : "Create Citizen Account")}
              </button>
            </form>
          )}
        </GlassCard>
      </div>
    );
  }

  // --- AUTHENTICATED CITIZEN DASHBOARD ---
  const savedCertObjects = certificates.filter((c) => user.savedCertificates?.includes(c.id));
  const savedSchemeObjects = schemes.filter((s) => user.savedSchemes?.includes(s.id));

  return (
    <div className="space-y-8">
      {/* Citizen Profile Header */}
      <GlassCard hoverEffect={false} className="border-l-4 border-l-emerald-600">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
              <UserCheck className="w-3 h-3" />
              {language === "te" ? "నమోదిత గ్రామ పౌరుడు" : "Verified Citizen Hub"}
            </span>
            <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white">
              {user.fullName}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              @{user.username} · {data.name} {user.ward ? `· Ward ${user.ward}` : ""} · +91 {user.phone || "N/A"}
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => onNavigate("citizen-services")}
              className="px-4 py-2 bg-gov-600 hover:bg-gov-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              {language === "te" ? "పథకాలు & పత్రాలు చూడండి" : "Browse Schemes & Docs"}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate("contact")}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              {language === "te" ? "కొత్త ఫిర్యాదు నమోదు" : "Lodge New Grievance"}
            </button>
            <button
              onClick={onLogout}
              className="px-3.5 py-2 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              {language === "te" ? "లాగ్ అవుట్" : "Logout"}
            </button>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Saved Document & Scheme Checklist */}
        <GlassCard hoverEffect={false} className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookmarkCheck className="w-5 h-5 text-emerald-600" />
              {language === "te" ? "నా సేవ్ చేసిన పత్రాలు & పథకాలు" : "My Saved Document & Scheme Checklist"}
            </h2>
            <span className="text-xs font-mono text-slate-400">
              {savedCertObjects.length + savedSchemeObjects.length}
            </span>
          </div>

          {savedCertObjects.length === 0 && savedSchemeObjects.length === 0 ? (
            <div className="text-center py-8 space-y-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === "te"
                  ? "మీరు ఇంకా ఏ సర్టిఫికేట్ లేదా పథకాన్ని సేవ్ చేయలేదు."
                  : "You haven't bookmarked any certificates or schemes yet."}
              </p>
              <button
                onClick={() => onNavigate("citizen-services")}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
              >
                {language === "te" ? "పౌర సేవలు చూడండి" : "Explore Citizen Services"}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {savedCertObjects.map((cert) => (
                <div
                  key={cert.id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gov-600 shrink-0" />
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {language === "te" && cert.nameTe ? cert.nameTe : cert.name}
                      </span>
                    </div>
                    <button
                      onClick={() => onToggleBookmark("certificate", cert.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    <strong className="text-slate-700 dark:text-slate-300">
                      {language === "te" ? "అవసరమైన పత్రాలు: " : "Required Docs: "}
                    </strong>
                    {cert.documents.join(" • ")}
                  </p>
                </div>
              ))}

              {savedSchemeObjects.map((scheme) => (
                <div
                  key={scheme.id}
                  className="p-3.5 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/10 border border-emerald-200/60 dark:border-emerald-900/40 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {language === "te" && scheme.nameTe ? scheme.nameTe : scheme.name}
                      </span>
                    </div>
                    <button
                      onClick={() => onToggleBookmark("scheme", scheme.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    <strong className="text-slate-700 dark:text-slate-300">
                      {language === "te" ? "అవసరమైన పత్రాలు: " : "Required Docs: "}
                    </strong>
                    {(scheme.documents || []).join(" • ") || "Check scheme guide"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </GlassCard>

        {/* My Grievances & Status Tracker */}
        <GlassCard hoverEffect={false} className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-gov-600" />
              {language === "te" ? "నా ఫిర్యాదుల స్థితి (Grievance Tracker)" : "My Grievance Status Tracker"}
            </h2>
            <button
              onClick={fetchMyGrievances}
              className="text-xs font-bold text-gov-600 hover:underline cursor-pointer"
            >
              {language === "te" ? "రిఫ్రెష్" : "Refresh"}
            </button>
          </div>

          {loadingMessages ? (
            <div className="py-10 flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-gov-600" />
            </div>
          ) : myMessages.length === 0 ? (
            <div className="text-center py-8 space-y-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === "te"
                  ? "మీ ఖాతా లేదా ఫోన్ నంబర్ ద్వారా ఎలాంటి ఫిర్యాదులు నమోదు కాలేదు."
                  : "No grievances or enquiries submitted from your account or phone number yet."}
              </p>
              <button
                onClick={() => onNavigate("contact")}
                className="px-4 py-2 bg-gov-600 hover:bg-gov-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
              >
                {language === "te" ? "ఫిర్యాదు నమోదు చేయండి" : "Submit a Grievance / Enquiry"}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {myMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono text-slate-400">{msg.date}</span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        msg.status === "resolved"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                          : msg.status === "read"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
                          : "bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300"
                      }`}
                    >
                      {msg.status === "resolved" ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      {msg.status === "unread"
                        ? language === "te"
                          ? "పెండింగ్"
                          : "Pending"
                        : msg.status === "read"
                        ? language === "te"
                          ? "పరిశీలనలో ఉంది"
                          : "Viewed"
                        : language === "te"
                        ? "పరిష్కరించబడింది"
                        : "Resolved"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {msg.message}
                  </p>

                  {msg.adminRemarks && (
                    <div className="p-2.5 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 text-[11px] text-emerald-900 dark:text-emerald-200">
                      <strong className="block uppercase text-[10px] text-emerald-700 dark:text-emerald-400 mb-0.5">
                        {language === "te" ? "సచివాలయ అధికారి స్పందన:" : "Official Sachivalayam Reply:"}
                      </strong>
                      {msg.adminRemarks}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
};

