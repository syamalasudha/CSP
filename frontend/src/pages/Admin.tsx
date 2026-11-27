/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { useLanguage } from "../components/LanguageContext";
import { GlassCard } from "../components/UIComponents";
import {
  Lock,
  User,
  LayoutDashboard,
  Megaphone,
  Briefcase,
  Image as ImageIcon,
  MessageSquare,
  Sparkles,
  Sliders,
  Trash2,
  CheckCircle,
  Plus,
  Loader2,
  Edit2,
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle,
  LockKeyhole,
  Eye,
  EyeOff,
  FileText,
  BookOpen
} from "lucide-react";
import { DatabaseSchema, StaffMember, Announcement, GalleryItem, ContactMessage, CertificateItem, SchemeItem } from "../types";
import { API_BASE, apiUrl } from "../config/api";

interface AdminProps {
  data: DatabaseSchema;
  token: string | null;
  onLoginSuccess: (token: string) => void;
  onRefreshData: () => void;
  onToastSuccess: (msg: string) => void;
  onToastError: (msg: string) => void;
}
// use shared API_BASE and apiUrl helper

export const Admin: React.FC<AdminProps> = ({
  data,
  token,
  onLoginSuccess,
  onRefreshData,
  onToastSuccess,
  onToastError,
}) => {
  const { language, t } = useLanguage();

  // Login credentials state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  // Dashboard Tab state
  const [activeTab, setActiveTab] = useState<
    "analytics" | "stats" | "staff" | "announcements" | "certificates" | "schemes" | "gallery" | "complaints"
  >("analytics");

  // Loading indicator for API mutations
  const [actionLoading, setActionLoading] = useState(false);

  // --- COMPLAINTS STATE ---
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [remarksDrafts, setRemarksDrafts] = useState<Record<string, string>>({});

  // --- CERTIFICATES & SCHEMES STATE ---
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [schemes, setSchemes] = useState<SchemeItem[]>([]);
  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  const [editingSchemeId, setEditingSchemeId] = useState<string | null>(null);
  const [editingAnnId, setEditingAnnId] = useState<string | null>(null);

  // Forms state
  const [newAnn, setNewAnn] = useState({ title: "", content: "", category: "General" });
  const [newStaff, setNewStaff] = useState({ name: "", designation: "", contact: "", department: "Sachivalayam" });
  const [newGal, setNewGal] = useState({ title: "", category: "Infrastructure", imageUrl: "" });
  const [certForm, setCertForm] = useState({
    name: "",
    nameTe: "",
    category: "identity",
    description: "",
    descriptionTe: "",
    documents: "",
    steps: "",
    processingTime: "7 - 15 Working Days",
    fee: "₹45 (MeeSeva / Sachivalayam)",
    officeLocation: "Village Secretariat / MeeSeva",
    downloadUrl: "",
    villageId: "all",
  });
  const [schemeForm, setSchemeForm] = useState({
    name: "",
    nameTe: "",
    category: "Welfare",
    benefits: "",
    benefitsTe: "",
    eligibility: "",
    eligibilityTe: "",
    documents: "",
    steps: "",
    officialUrl: "",
    villageId: "all",
  });

  // Dynamics Stats editing state
  const [editedStats, setEditedStats] = useState({
    population: data.stats?.population ?? 0,
    totalHouseholds: data.stats?.totalHouseholds ?? 0,
    areaSqKm: data.stats?.areaSqKm ?? 0,
    totalWards: data.stats?.totalWards ?? 0,
    ledStreetLights: data.infrastructure?.ledStreetLights ?? 0,
    groupsWithBankLoans: data.shg?.groupsWithBankLoans ?? 0,
  });

  useEffect(() => {
    setEditedStats({
      population: data.stats?.population ?? 0,
      totalHouseholds: data.stats?.totalHouseholds ?? 0,
      areaSqKm: data.stats?.areaSqKm ?? 0,
      totalWards: data.stats?.totalWards ?? 0,
      ledStreetLights: data.infrastructure?.ledStreetLights ?? 0,
      groupsWithBankLoans: data.shg?.groupsWithBankLoans ?? 0,
    });
  }, [data]);

  useEffect(() => {
    if (token) {
      fetchComplaints();
      fetchServices();
    }
  }, [token, data.id]);

  const fetchServices = async () => {
    try {
      const res = await fetch(apiUrl(`/api/services?villageId=${encodeURIComponent(data.id)}`));
      if (res.ok) {
        const json = await res.json();
        setCertificates(json.certificates || []);
        setSchemes(json.schemes || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchComplaints = async () => {
    try {
      const res = await fetch(apiUrl(`/api/messages?villageId=${encodeURIComponent(data.id)}`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const d: ContactMessage[] = await res.json();
        setMessages(d);
        const initialDrafts: Record<string, string> = {};
        d.forEach((m) => {
          initialDrafts[m.id] = m.adminRemarks || "";
        });
        setRemarksDrafts(initialDrafts);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Auth logins handler
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      onToastError(language === "te" ? "వినియోగదారు పేరు మరియు పాస్‌వర్డ్ అవసరం." : "Username and password are required.");
      return;
    }

    setLoginLoading(true);
    try {
      const res = await fetch(apiUrl(`/api/auth/login`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, expectedRole: "admin" }),
      });

      const block = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(block.error || (language === "te" ? "వినియోగదారు పేరు లేదా పాస్‌వర్డ్ సరైనది కాదు" : "Invalid username or password"));
      }

      onLoginSuccess(block.token);
      onToastSuccess(language === "te" ? "ధృవీకరణ పూర్తయింది. సుస్వాగతం." : "Access Authorized. Welcome back, Admin.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      onToastError(message || (language === "te" ? "లాగిన్ సమయంలో లోపం తలెత్తింది." : "An authentication dispute occurred."));
    } finally {
      setLoginLoading(false);
    }
  };

  // Dynamic stats editor PUT request
  const handleSaveStats = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      // 1. Update stats
      const statsRes = await fetch(apiUrl(`/api/data/sections`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          villageId: data.id,
          key: "stats",
          payload: {
            population: Number(editedStats.population),
            totalHouseholds: Number(editedStats.totalHouseholds),
            areaSqKm: Number(editedStats.areaSqKm),
            totalWards: Number(editedStats.totalWards),
          },
        }),
      });
      if (!statsRes.ok) {
        const err = await statsRes.json().catch(() => ({}));
        throw new Error(err.error || "Failed to update census stats");
      }

      // 2. Update Lights
      const infraRes = await fetch(apiUrl(`/api/data/sections`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          villageId: data.id,
          key: "infrastructure",
          payload: { ledStreetLights: Number(editedStats.ledStreetLights) },
        }),
      });
      if (!infraRes.ok) {
        const err = await infraRes.json().catch(() => ({}));
        throw new Error(err.error || "Failed to update infrastructure stats");
      }

      onRefreshData();
      onToastSuccess(language === "te" ? "గ్రామ జనాభా గణాంకాలు పబ్లిక్ పోర్టల్‌లో నవీకరించబడ్డాయి!" : "Village core census statistics successfully updated on public portal!");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      onToastError(msg || (language === "te" ? "సమాచారాన్ని నవీకరించలేకపోయాము." : "Could not update figures."));
    } finally {
      setActionLoading(false);
    }
  };

  // CRUD: STAFF Addition
  const handleAddStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.designation || !newStaff.contact) {
      onToastError(language === "te" ? "దయచేసి అన్ని సిబ్బంది ఫీల్డ్‌లను పూరించండి." : "Fill in all staff fields.");
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch(apiUrl(`/api/staff`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...newStaff, villageId: data.id }),
      });

      if (!res.ok) throw new Error("Add staff failed");
      onToastSuccess(language === "te" ? `ఉద్యోగి '${newStaff.name}' విజయవంతంగా చేర్చబడ్డారు!` : `Staff member '${newStaff.name}' successfully added!`);
      setNewStaff({ name: "", designation: "", contact: "", department: "Sachivalayam" });
      onRefreshData();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error saving staff member.";
      onToastError(message);
    } finally {
      setActionLoading(false);
    }
  };

  // CRUD: STAFF Deletion
  const handleDeleteStaff = async (id: string, name: string) => {
    if (!confirm(language === "te" ? `మీరు నిజంగా ఉద్యోగి '${name}' వివరాలను తొలగించాలనుకుంటున్నారా?` : `Are you sure you want to remove staff ${name}?`)) return;
    try {
      const res = await fetch(apiUrl(`/api/staff/${id}?villageId=${encodeURIComponent(data.id)}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete staff failed");
      onToastSuccess(language === "te" ? `ఉద్యోగి '${name}' వివరాలు తొలగించబడ్డాయి.` : `Staff member ${name} removed.`);
      onRefreshData();
    } catch (err) {
      onToastError("Error deleting staff member.");
    }
  };

  // CRUD: ANNOUNCEMENT Add / Edit
  const handleAddAnnouncementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnn.title || !newAnn.content) {
      onToastError(language === "te" ? "శీర్షిక మరియు సమాచారం తప్పనిసరి." : "Announcements require titles and descriptions.");
      return;
    }

    setActionLoading(true);
    try {
      const url = editingAnnId ? apiUrl(`/api/announcements/${editingAnnId}`) : apiUrl(`/api/announcements`);
      const method = editingAnnId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...newAnn, villageId: data.id }),
      });

      if (!res.ok) throw new Error(editingAnnId ? "Update Announcement failed" : "Add Announcement failed");
      onToastSuccess(
        editingAnnId
          ? (language === "te" ? "ప్రకటన విజయవంతంగా నవీకరించబడింది!" : "Announcement updated successfully!")
          : (language === "te" ? "ప్రకటన విజయవంతంగా వార్తా విభాగంలో ప్రచురించబడింది!" : "Announcement successfully pinned into public news desk!")
      );
      setNewAnn({ title: "", content: "", category: "General" });
      setEditingAnnId(null);
      onRefreshData();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error publishing announcement.";
      onToastError(message);
    } finally {
      setActionLoading(false);
    }
  };

  // CRUD: CERTIFICATES / DOCUMENTS
  const resetCertForm = () => {
    setEditingCertId(null);
    setCertForm({
      name: "",
      nameTe: "",
      category: "identity",
      description: "",
      descriptionTe: "",
      documents: "",
      steps: "",
      processingTime: "7 - 15 Working Days",
      fee: "₹45 (MeeSeva / Sachivalayam)",
      officeLocation: "Village Secretariat / MeeSeva",
      downloadUrl: "",
      villageId: "all",
    });
  };

  const handleSaveCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certForm.name || !certForm.description) {
      onToastError("Certificate name and description are required.");
      return;
    }
    setActionLoading(true);
    try {
      const url = editingCertId
        ? apiUrl(`/api/services/certificates/${editingCertId}`)
        : apiUrl(`/api/services/certificates`);
      const res = await fetch(url, {
        method: editingCertId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(certForm),
      });
      if (!res.ok) throw new Error("Failed saving certificate guide");
      onToastSuccess(editingCertId ? "Certificate guide updated!" : "Certificate guide added to portal!");
      resetCertForm();
      fetchServices();
    } catch (err) {
      onToastError(err instanceof Error ? err.message : "Error saving certificate");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCertificate = async (id: string, name: string) => {
    if (!confirm(`Delete certificate guide "${name}"?`)) return;
    try {
      const res = await fetch(apiUrl(`/api/services/certificates/${id}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed deleting certificate");
      onToastSuccess("Certificate guide deleted.");
      fetchServices();
    } catch {
      onToastError("Delete failed.");
    }
  };

  // CRUD: GOVERNMENT SCHEMES
  const resetSchemeForm = () => {
    setEditingSchemeId(null);
    setSchemeForm({
      name: "",
      nameTe: "",
      category: "Welfare",
      benefits: "",
      benefitsTe: "",
      eligibility: "",
      eligibilityTe: "",
      documents: "",
      steps: "",
      officialUrl: "",
      villageId: "all",
    });
  };

  const handleSaveScheme = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schemeForm.name || !schemeForm.eligibility) {
      onToastError("Scheme name and eligibility are required.");
      return;
    }
    setActionLoading(true);
    try {
      const url = editingSchemeId
        ? apiUrl(`/api/services/schemes/${editingSchemeId}`)
        : apiUrl(`/api/services/schemes`);
      const res = await fetch(url, {
        method: editingSchemeId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(schemeForm),
      });
      if (!res.ok) throw new Error("Failed saving government scheme");
      onToastSuccess(editingSchemeId ? "Government scheme updated!" : "Government scheme added to portal!");
      resetSchemeForm();
      fetchServices();
    } catch (err) {
      onToastError(err instanceof Error ? err.message : "Error saving scheme");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteScheme = async (id: string, name: string) => {
    if (!confirm(`Delete scheme "${name}"?`)) return;
    try {
      const res = await fetch(apiUrl(`/api/services/schemes/${id}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed deleting scheme");
      onToastSuccess("Government scheme deleted.");
      fetchServices();
    } catch {
      onToastError("Delete failed.");
    }
  };

  // CRUD: ANNOUNCEMENT delete
  const handleDeleteAnn = async (id: string) => {
    if (!confirm(language === "te" ? "మీరు నిజంగా ఈ ప్రకటనను తొలగించాలనుకుంటున్నారా?" : "Are you sure you want to delete this announcement?")) return;
    try {
      const res = await fetch(apiUrl(`/api/announcements/${id}?villageId=${encodeURIComponent(data.id)}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete");
      onToastSuccess(language === "te" ? "ప్రకటన విజయవంతంగా తొలగించబడింది." : "Announcement deleted from news feeds.");
      onRefreshData();
    } catch (err) {
      onToastError("Failed to delete.");
    }
  };

  // CRUD: GALLERY Images Upload/Add
  const handleAddGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGal.imageUrl) {
      onToastError(language === "te" ? "చిత్రం URL లింక్ తప్పనిసరి." : "An Image URL or data link is required.");
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch(apiUrl(`/api/gallery`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...newGal, villageId: data.id }),
      });

      if (!res.ok) throw new Error("Could not add photo");
      onToastSuccess(language === "te" ? "చిత్రం విజయవంతంగా ఆల్బమ్‌లో చేర్చబడింది!" : "Gallery photography successfully posted!");
      setNewGal({ title: "", category: "Infrastructure", imageUrl: "" });
      onRefreshData();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error adding photo.";
      onToastError(message);
    } finally {
      setActionLoading(false);
    }
  };

  // CRUD: GALLERY delete
  const handleDeleteGal = async (id: string) => {
    if (!confirm(language === "te" ? "ఈ ఫోటోను తొలగించాలనుకుంటున్నారా?" : "Do you want to delete this photo?")) return;
    try {
      const res = await fetch(apiUrl(`/api/gallery/${id}?villageId=${encodeURIComponent(data.id)}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      onToastSuccess("Photo deleted.");
      onRefreshData();
    } catch (err) {
      onToastError("Delete failed");
    }
  };

  // CRUD: COMPLAINT resolve / reply
  const handleUpdateComplaintStatus = async (id: string, status: "read" | "resolved") => {
    try {
      const res = await fetch(apiUrl(`/api/messages/${id}`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, adminRemarks: remarksDrafts[id] ?? "" }),
      });
      if (!res.ok) throw new Error("Update failed");
      onToastSuccess(language === "te" ? `ఫిర్యాదు స్థితి [${status}] కి మార్చబడింది.` : `Grievance updated to [${status}] with remarks.`);
      fetchComplaints();
    } catch (err) {
      onToastError("Failed to update ticket.");
    }
  };

  // CRUD: COMPLAINT Delete
  const handleDeleteComplaint = async (id: string) => {
    if (!confirm(language === "te" ? "ఈ టికెట్‌ను శాశ్వతంగా తొలగించాలా?" : "Remove this ticket permanently?")) return;
    try {
      const res = await fetch(apiUrl(`/api/messages/${id}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        onToastSuccess(language === "te" ? "టికెట్ శాశ్వతంగా తొలగించబడింది." : "Ticket removed from administrative lists.");
        fetchComplaints();
      }
    } catch (e) {
      onToastError("Failed to remove ticket.");
    }
  };

  // UNPROTECTED LOGIN PAGE VIEW
  if (!token) {
    return (
      <div className="max-w-md mx-auto py-12">
        <GlassCard hoverEffect={false} className="border-t-4 border-amber-500 bg-slate-50/50 p-8 shadow-lg">
          <div className="text-center space-y-4 mb-6">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-950/45 text-amber-700 dark:text-amber-400 rounded-2xl flex items-center justify-center mx-auto shadow">
              <LockKeyhole className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-display font-black text-slate-900 dark:text-white">
                {language === "te" ? "అడ్మిన్ లాగిన్ ధృవీకరణ" : "Admin Area Authentication"}
              </h2>
              <p className="text-xs text-slate-500 mt-1 dark:text-slate-400 font-sans">
                {language === "te" ? `${data.nameTe || data.name} గ్రామ పంచాయతీ ప్రత్యేక అడ్మినిస్ట్రేటర్ పోర్టల్ లాగిన్.` : `Authenticates session credentials for the ${data.name} administrative dashboard.`}
              </p>
            </div>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs font-sans">
            <div className="space-y-1">
              <label className="font-bold text-slate-650 dark:text-slate-400 uppercase">
                {language === "te" ? "వినియోగదారు పేరు" : "Username"}
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                placeholder="e.g. admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-650 dark:text-slate-400 uppercase">
                {language === "te" ? "పాస్‌వర్డ్" : "Password"}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-2.5 pr-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-500 transition cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition shadow flex items-center justify-center gap-2 cursor-pointer"
            >
              {loginLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (language === "te" ? "అడ్మిన్ డ్యాష్‌బోర్డ్ వెళ్లండి" : "Access Dashboard")}
            </button>
          </form>

          {/* Quick instructions for base admin login */}
          <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-800 text-[10px] text-slate-400 font-sans leading-relaxed text-center space-y-1.5">
            <div>
              {language === "te" ? "* బేస్ అడ్మిన్ లాగిన్: " : "* Base Admin Credentials: "}
              <span className="font-mono bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 px-1 py-0.5 rounded">admin</span> / <span className="font-mono bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 px-1 py-0.5 rounded">password123</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setUsername("admin");
                setPassword("password123");
              }}
              className="text-[11px] font-bold text-amber-600 hover:underline cursor-pointer"
            >
              {language === "te" ? "డెమో వివరాలు నింపండి" : "Fill Demo Admin Credentials"}
            </button>
          </div>
        </GlassCard>
      </div>
    );
  }

  // PROTECTED ADMIN DASHBOARD PANELS
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Control Sidebar */}
      <div className="lg:col-span-1 space-y-4">
        <GlassCard hoverEffect={false} className="p-4 space-y-2.5">
          <div className="flex items-center gap-2 px-3 py-2 text-gov-800 dark:text-gov-300 font-bold text-sm bg-gov-50/50 dark:bg-slate-900/60 rounded-xl mb-4 border border-gov-100/10 shrink-0">
            <ShieldCheck className="w-4 h-4" />
            <span>{language === "te" ? "అడ్మిన్ నియంత్రణ ప్యానెల్" : "Admin Control Panel"}</span>
          </div>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === "analytics" ? "bg-gov-600 text-white" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/40"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            {language === "te" ? "డ్యాష్‌బోర్డ్ హోమ్" : "Dashboard Welcome"}
          </button>

          <button
            onClick={() => setActiveTab("stats")}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === "stats" ? "bg-gov-600 text-white" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/40"
            }`}
          >
            <Sliders className="w-4 h-4" />
            {language === "te" ? "జనాభా లెక్కల మార్పు" : "Edit Village Data"}
          </button>

          <button
            onClick={() => setActiveTab("staff")}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === "staff" ? "bg-gov-600 text-white" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/40"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            {language === "te" ? `సిబ్బంది నిర్వహణ (${data.staff.length})` : `Manage Staff (${data.staff.length})`}
          </button>

          <button
            onClick={() => setActiveTab("announcements")}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === "announcements" ? "bg-gov-600 text-white" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/40"
            }`}
          >
            <Megaphone className="w-4 h-4" />
            {language === "te" ? `వార్తలు & నోటీసులు (${data.announcements.length})` : `News & Notices (${data.announcements.length})`}
          </button>

          <button
            onClick={() => setActiveTab("certificates")}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === "certificates" ? "bg-gov-600 text-white" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/40"
            }`}
          >
            <FileText className="w-4 h-4" />
            {language === "te" ? `సర్టిఫికేట్లు & పత్రాలు (${certificates.length})` : `Documents & Certs (${certificates.length})`}
          </button>

          <button
            onClick={() => setActiveTab("schemes")}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === "schemes" ? "bg-gov-600 text-white" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/40"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            {language === "te" ? `ప్రభుత్వ పథకాలు (${schemes.length})` : `Govt Schemes (${schemes.length})`}
          </button>

          <button
            onClick={() => setActiveTab("gallery")}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === "gallery" ? "bg-gov-600 text-white" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/40"
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            {language === "te" ? `ఆల్బమ్ ఫోటోలు (${data.gallery.length})` : `Manage Gallery (${data.gallery.length})`}
          </button>

          <button
            onClick={() => setActiveTab("complaints")}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === "complaints" ? "bg-gov-600 text-white" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/40"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-4 h-4" />
              <span>{language === "te" ? "ఫిర్యాదుల జాబితా" : "Grievances List"}</span>
            </div>
            <span className="font-mono text-[10px] bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 px-1.5 py-0.5 rounded-full font-bold">
              {messages.filter(m => m.status === "unread").length}
            </span>
          </button>
        </GlassCard>
      </div>

      {/* Main Panel Content */}
      <div className="lg:col-span-3 space-y-6">
        {/* TAB 1: WELCOME ANALYTICS */}
        {activeTab === "analytics" && (
          <GlassCard hoverEffect={false} className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl font-display font-black text-slate-900 dark:text-white flex items-center gap-2 leading-none">
                <Sparkles className="w-5 h-5 text-amber-500" />
                {t("badge_admin_dashboard")}
              </h3>
              <p className="text-xs text-slate-500 font-sans">
                {language === "te" ? "గ్రామ సేవలు, అధికారిక నియామకాలు మరియు పబ్లిక్ నోటీసుల సమగ్ర వేదిక." : "Manage all citizen services, staff directories, and portal announcements."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl flex items-center gap-3">
                <Briefcase className="w-7 h-7 text-gov-600 shrink-0" />
                <div className="font-sans">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">
                    {language === "te" ? "మొత్తం ఉద్యోగులు" : "Total Staff"}
                  </span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">{data.staff.length}</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl flex items-center gap-3">
                <FileText className="w-7 h-7 text-blue-600 shrink-0" />
                <div className="font-sans">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">
                    {language === "te" ? "పత్రాలు & సర్టిఫికేట్లు" : "Document Guides"}
                  </span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">{certificates.length}</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl flex items-center gap-3">
                <BookOpen className="w-7 h-7 text-emerald-600 shrink-0" />
                <div className="font-sans">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">
                    {language === "te" ? "ప్రభుత్వ పథకాలు" : "Govt Schemes"}
                  </span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">{schemes.length}</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl flex items-center gap-3">
                <MessageSquare className="w-7 h-7 text-rose-600 shrink-0" />
                <div className="font-sans">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">
                    {language === "te" ? "పెండింగ్ అర్జీలు" : "Open Tickets"}
                  </span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">
                    {messages.filter(m => m.status !== "resolved").length}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-amber-50/50 dark:bg-slate-900/20 border border-amber-200/50 rounded-2xl text-[11px] sm:text-xs text-amber-800 dark:text-amber-300 flex gap-3 font-sans">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
              <div className="space-y-1 leading-relaxed">
                <span className="font-bold">{language === "te" ? "భద్రతా నోటీసు:" : "Security Notice:"}</span>
                <p>
                  {language === "te"
                    ? "మీ లాగిన్ సెషన్ గరిష్ఠంగా 24 గంటలు మాత్రమే యాక్టివ్‌గా ఉంటుంది. మార్పులు పూర్తయిన తర్వాత భద్రతా కారణాల వల్ల దయచేసి లాగ్ అవుట్ చేయండి."
                    : "Your current session token is hosted locally and will expire in 24 hours. Log out after modifying files to secure the portal database."}
                </p>
              </div>
            </div>
          </GlassCard>
        )}

        {/* TAB 2: EDIT SYSTEM STATISTICS */}
        {activeTab === "stats" && (
          <GlassCard hoverEffect={false}>
            <form onSubmit={handleSaveStats} className="space-y-6 text-xs sm:text-sm font-sans">
              <h3 className="text-base font-display font-medium text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                {language === "te" ? "గ్రామ ప్రాథమిక గణాంకాల నవీకరణ" : "Update Core Village Census"}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">{language === "te" ? "గ్రామ నివాసితుల జనాభా" : "Population Count"}</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 dark:text-white font-display font-bold"
                    value={editedStats.population}
                    onChange={(e) => setEditedStats({ ...editedStats, population: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">{language === "te" ? "మొత్తం ఇళ్ల సంఖ్య" : "Total Households"}</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 dark:text-white font-display font-bold"
                    value={editedStats.totalHouseholds}
                    onChange={(e) => setEditedStats({ ...editedStats, totalHouseholds: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">{language === "te" ? "భౌగోళిక వైశాల్యం (Km²)" : "Geographic Area (Km²)"}</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-4 py-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 dark:text-white font-display font-bold"
                    value={editedStats.areaSqKm}
                    onChange={(e) => setEditedStats({ ...editedStats, areaSqKm: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">{language === "te" ? "మొత్తం వార్డులు" : "Total Elector Wards"}</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 dark:text-white font-display font-bold"
                    value={editedStats.totalWards}
                    onChange={(e) => setEditedStats({ ...editedStats, totalWards: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">{language === "te" ? "అమర్చిన వీధి దీపాలు (L.E.D)" : "LED Street Light Units"}</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 dark:text-white font-display font-bold"
                    value={editedStats.ledStreetLights}
                    onChange={(e) => setEditedStats({ ...editedStats, ledStreetLights: Number(e.target.value) })}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={actionLoading}
                className="px-6 py-2.5 bg-gov-600 hover:bg-gov-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (language === "te" ? "గణాంకాలు సేవ్ చేయండి" : "Save Census Records")}
              </button>
            </form>
          </GlassCard>
        )}

        {/* TAB 3: MANAGE STAFF MEMBERS */}
        {activeTab === "staff" && (
          <div className="space-y-6">
            <GlassCard hoverEffect={false}>
              <form onSubmit={handleAddStaffSubmit} className="space-y-4 text-xs font-sans">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800 uppercase tracking-wider">
                  {language === "te" ? "నూతన పౌర సేవా సిబ్బంది నమోదు" : "Add New Administrative Staff"}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">{language === "te" ? "సిబ్బంది పేరు" : "Name"}</label>
                    <input
                      required
                      type="text"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl dark:text-white"
                      value={newStaff.name}
                      onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">{language === "te" ? "హోదా / ఉద్యోగ బాధ్యత" : "Designation / Role"}</label>
                    <input
                      required
                      type="text"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl dark:text-white"
                      value={newStaff.designation}
                      onChange={(e) => setNewStaff({ ...newStaff, designation: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">{language === "te" ? "మొబైల్ ఫోన్ నెంబర్" : "Active Mobile Contact"}</label>
                    <input
                      required
                      type="tel"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl dark:text-white"
                      value={newStaff.contact}
                      onChange={(e) => setNewStaff({ ...newStaff, contact: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">{language === "te" ? "విభాగం" : "Department Directory Group"}</label>
                    <select
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl dark:text-white"
                      value={newStaff.department}
                      onChange={(e) => setNewStaff({ ...newStaff, department: e.target.value as any })}
                    >
                      <option value="Sachivalayam">Sachivalayam</option>
                      <option value="Anganwadi">Anganwadi</option>
                      <option value="VOA">VOA Help</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 bg-gov-600 hover:bg-gov-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  {language === "te" ? "సిబ్బందిని నమోదు చేయండి" : "Save Staff Member"}
                </button>
              </form>
            </GlassCard>

            {/* Existing staff lists table */}
            <GlassCard hoverEffect={false} className="p-4">
              <h3 className="text-sm font-bold text-slate-950 dark:text-white mb-4">
                {language === "te" ? "ప్రస్తుత సిబ్బంది జాబితా" : "Core Directory Registry"}
              </h3>
              <div className="overflow-x-auto text-xs sm:text-sm font-sans">
                <table className="w-full divide-y divide-slate-100 dark:divide-slate-800">
                  <thead>
                    <tr className="text-[10px] text-slate-400 font-bold uppercase text-left bg-slate-50/50 dark:bg-slate-900/10">
                      <th className="py-2.5 px-3">{language === "te" ? "సిబ్బంది వివరాలు" : "Staff Details"}</th>
                      <th className="py-2.5 px-3">{language === "te" ? "ఫోన్" : "Contact"}</th>
                      <th className="py-2.5 px-3">{language === "te" ? "విభాగం" : "Dept"}</th>
                      <th className="py-2.5 px-3 text-right">{language === "te" ? "తొలగించు" : "Delete"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 leading-none">
                    {data.staff.map((s: StaffMember) => (
                      <tr key={s.id} className="hover:bg-slate-50/40">
                        <td className="py-3 px-3">
                          <span className="font-bold text-slate-900 dark:text-white block">{s.name}</span>
                          <span className="text-[10px] text-slate-400">{s.designation}</span>
                        </td>
                        <td className="py-3 px-3 font-mono">{s.contact}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-slate-100 dark:bg-slate-900 dark:text-slate-400">{s.department}</span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => handleDeleteStaff(s.id, s.name)}
                            className="p-1 px-2.5 bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 hover:bg-rose-150 rounded-lg transition cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </div>
        )}

        {/* TAB 4: ANNOUNCEMENTS MANAGER */}
        {activeTab === "announcements" && (
          <div className="space-y-6">
            <GlassCard hoverEffect={false}>
              <form onSubmit={handleAddAnnouncementSubmit} className="space-y-4 text-xs font-sans">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800 uppercase tracking-wider">
                  {language === "te" ? "కొత్త పబ్లిక్ నోటీసు ప్రచురించండి" : "Post New Public Announcement"}
                </h3>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500">{language === "te" ? "ప్రకటన శీర్షిక" : "Notice Title"}</label>
                  <input
                    required
                    type="text"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl dark:text-white"
                    placeholder="e.g. Portal Announcement"
                    value={newAnn.title}
                    onChange={(e) => setNewAnn({ ...newAnn, title: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">{language === "te" ? "క్యాటగిరి ట్యాగ్" : "Category Tag"}</label>
                    <select
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl dark:text-white"
                      value={newAnn.category}
                      onChange={(e) => setNewAnn({ ...newAnn, category: e.target.value })}
                    >
                      <option value="General">General News</option>
                      <option value="Welfare">Welfare & Pensions</option>
                      <option value="Meeting">Council Meeting</option>
                      <option value="Alert">Urgent Announcement</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500">{language === "te" ? "ప్రకటన పూర్తి సమాచారం" : "Notice Content (Full description)"}</label>
                  <textarea
                    required
                    rows={3}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl dark:text-white resize-none"
                    placeholder="Provide full description of dynamic welfare updates..."
                    value={newAnn.content}
                    onChange={(e) => setNewAnn({ ...newAnn, content: e.target.value })}
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-5 py-2.5 bg-gov-600 hover:bg-gov-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
                  >
                    {editingAnnId
                      ? (language === "te" ? "మార్పులు సేవ్ చేయండి" : "Update Announcement")
                      : (language === "te" ? "అధికారికంగా ప్రచురించండి" : "Publish Announcement")}
                  </button>
                  {editingAnnId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingAnnId(null);
                        setNewAnn({ title: "", content: "", category: "General" });
                      }}
                      className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl cursor-pointer"
                    >
                      {language === "te" ? "రద్దు" : "Cancel"}
                    </button>
                  )}
                </div>
              </form>
            </GlassCard>

            {/* List announcements */}
            <GlassCard hoverEffect={false} className="p-4 font-sans text-xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
                {language === "te" ? "ప్రస్తుత నోటీసులు" : "Active Notices"}
              </h3>
              <div className="space-y-3">
                {data.announcements.map((ann) => (
                  <div key={ann.id} className="flex justify-between items-start gap-4 p-3 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <h4 className="font-bold text-slate-950 dark:text-white">{ann.title}</h4>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{ann.category} | {ann.date}</span>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setEditingAnnId(ann.id);
                          setNewAnn({ title: ann.title, content: ann.content, category: ann.category });
                        }}
                        className="p-1 px-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 cursor-pointer"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteAnn(ann.id)}
                        className="p-1 px-2.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        )}

        {/* TAB 4B: CERTIFICATES & DOCUMENTS MANAGER */}
        {activeTab === "certificates" && (
          <div className="space-y-6">
            <GlassCard hoverEffect={false}>
              <form onSubmit={handleSaveCertificate} className="space-y-4 text-xs font-sans">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800 uppercase tracking-wider">
                  {editingCertId
                    ? (language === "te" ? "సర్టిఫికేట్ గైడ్ సవరించండి" : "Edit Certificate / Document Guide")
                    : (language === "te" ? "కొత్త సర్టిఫికేట్ / పత్రం గైడ్ జోడించండి" : "Add New Certificate / Document Guide")}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Certificate Name (English) *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Residence Certificate"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl dark:text-white"
                      value={certForm.name}
                      onChange={(e) => setCertForm({ ...certForm, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Certificate Name (Telugu)</label>
                    <input
                      type="text"
                      placeholder="ఉదా: నివాస ధృవీకరణ పత్రం"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl dark:text-white"
                      value={certForm.nameTe}
                      onChange={(e) => setCertForm({ ...certForm, nameTe: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Category</label>
                    <select
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl dark:text-white"
                      value={certForm.category}
                      onChange={(e) => setCertForm({ ...certForm, category: e.target.value })}
                    >
                      <option value="identity">Identity</option>
                      <option value="welfare">Welfare</option>
                      <option value="records">Records</option>
                      <option value="revenue">Revenue</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Visibility Scope</label>
                    <select
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl dark:text-white"
                      value={certForm.villageId}
                      onChange={(e) => setCertForm({ ...certForm, villageId: e.target.value })}
                    >
                      <option value="all">All Villages (Statewide)</option>
                      <option value={data.id}>Only {data.name}</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Processing Timeline</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl dark:text-white"
                      value={certForm.processingTime}
                      onChange={(e) => setCertForm({ ...certForm, processingTime: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Fee & Office</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl dark:text-white"
                      value={certForm.fee}
                      onChange={(e) => setCertForm({ ...certForm, fee: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Description (English) *</label>
                    <textarea
                      required
                      rows={2}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl dark:text-white resize-none"
                      value={certForm.description}
                      onChange={(e) => setCertForm({ ...certForm, description: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Description (Telugu)</label>
                    <textarea
                      rows={2}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl dark:text-white resize-none"
                      value={certForm.descriptionTe}
                      onChange={(e) => setCertForm({ ...certForm, descriptionTe: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Required Documents (one per line or comma-separated)</label>
                    <textarea
                      rows={3}
                      placeholder={"Aadhaar Card\nRation Card\nPassport Photo"}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl dark:text-white resize-none"
                      value={certForm.documents}
                      onChange={(e) => setCertForm({ ...certForm, documents: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Application Steps (one per line)</label>
                    <textarea
                      rows={3}
                      placeholder={"Visit Village Secretariat\nSubmit form with proofs\nVRO verification"}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl dark:text-white resize-none"
                      value={certForm.steps}
                      onChange={(e) => setCertForm({ ...certForm, steps: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Application Form URL (Optional)</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl dark:text-white"
                    value={certForm.downloadUrl}
                    onChange={(e) => setCertForm({ ...certForm, downloadUrl: e.target.value })}
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-5 py-2.5 bg-gov-600 hover:bg-gov-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
                  >
                    {editingCertId ? "Update Certificate Guide" : "Save Certificate Guide"}
                  </button>
                  {editingCertId && (
                    <button
                      type="button"
                      onClick={resetCertForm}
                      className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </GlassCard>

            <GlassCard hoverEffect={false} className="p-4 font-sans text-xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
                Published Certificates & Document Guides ({certificates.length})
              </h3>
              <div className="space-y-3">
                {certificates.map((cert) => (
                  <div key={cert.id} className="flex justify-between items-start gap-4 p-3 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <h4 className="font-bold text-slate-950 dark:text-white">{cert.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{cert.documents.length} required docs · {cert.category} · {cert.villageId === "all" ? "All Villages" : cert.villageId}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setEditingCertId(cert.id);
                          setCertForm({
                            name: cert.name,
                            nameTe: cert.nameTe || "",
                            category: cert.category,
                            description: cert.description,
                            descriptionTe: cert.descriptionTe || "",
                            documents: cert.documents.join("\n"),
                            steps: cert.steps.join("\n"),
                            processingTime: cert.processingTime || "7 - 15 Working Days",
                            fee: cert.fee || "Nominal",
                            officeLocation: cert.officeLocation || "Village Secretariat / MeeSeva",
                            downloadUrl: cert.downloadUrl || "",
                            villageId: cert.villageId || "all",
                          });
                        }}
                        className="p-1 px-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCertificate(cert.id, cert.name)}
                        className="p-1 px-2.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        )}

        {/* TAB 4C: GOVERNMENT SCHEMES MANAGER */}
        {activeTab === "schemes" && (
          <div className="space-y-6">
            <GlassCard hoverEffect={false}>
              <form onSubmit={handleSaveScheme} className="space-y-4 text-xs font-sans">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800 uppercase tracking-wider">
                  {editingSchemeId ? "Edit Government Scheme" : "Add New Government Welfare Scheme"}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Scheme Name (English) *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. NTR Housing Scheme"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl dark:text-white"
                      value={schemeForm.name}
                      onChange={(e) => setSchemeForm({ ...schemeForm, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Scheme Name (Telugu)</label>
                    <input
                      type="text"
                      placeholder="ఉదా: ఎన్టీఆర్ గృహ నిర్మాణ పథకం"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl dark:text-white"
                      value={schemeForm.nameTe}
                      onChange={(e) => setSchemeForm({ ...schemeForm, nameTe: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Category</label>
                    <select
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl dark:text-white"
                      value={schemeForm.category}
                      onChange={(e) => setSchemeForm({ ...schemeForm, category: e.target.value })}
                    >
                      <option value="Welfare">Welfare</option>
                      <option value="Pension">Pension</option>
                      <option value="Agriculture">Agriculture</option>
                      <option value="Education">Education</option>
                      <option value="Food">Food</option>
                      <option value="Housing">Housing</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Visibility Scope</label>
                    <select
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl dark:text-white"
                      value={schemeForm.villageId}
                      onChange={(e) => setSchemeForm({ ...schemeForm, villageId: e.target.value })}
                    >
                      <option value="all">All Villages (Statewide)</option>
                      <option value={data.id}>Only {data.name}</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Benefits (English)</label>
                    <textarea
                      rows={2}
                      placeholder="Financial support or service benefits..."
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl dark:text-white resize-none"
                      value={schemeForm.benefits}
                      onChange={(e) => setSchemeForm({ ...schemeForm, benefits: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Benefits (Telugu)</label>
                    <textarea
                      rows={2}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl dark:text-white resize-none"
                      value={schemeForm.benefitsTe}
                      onChange={(e) => setSchemeForm({ ...schemeForm, benefitsTe: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Eligibility Criteria (English) *</label>
                    <textarea
                      required
                      rows={2}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl dark:text-white resize-none"
                      value={schemeForm.eligibility}
                      onChange={(e) => setSchemeForm({ ...schemeForm, eligibility: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Eligibility Criteria (Telugu)</label>
                    <textarea
                      rows={2}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl dark:text-white resize-none"
                      value={schemeForm.eligibilityTe}
                      onChange={(e) => setSchemeForm({ ...schemeForm, eligibilityTe: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">Required Documents (one per line or comma-separated)</label>
                    <textarea
                      rows={3}
                      placeholder={"Aadhaar Card\nRice Card\nBank Passbook"}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl dark:text-white resize-none"
                      value={schemeForm.documents}
                      onChange={(e) => setSchemeForm({ ...schemeForm, documents: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">How to Apply Steps (one per line)</label>
                    <textarea
                      rows={3}
                      placeholder={"Meet Ward Welfare Assistant\nSubmit e-KYC and proofs"}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl dark:text-white resize-none"
                      value={schemeForm.steps}
                      onChange={(e) => setSchemeForm({ ...schemeForm, steps: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500">Official Portal URL (Optional)</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl dark:text-white"
                    value={schemeForm.officialUrl}
                    onChange={(e) => setSchemeForm({ ...schemeForm, officialUrl: e.target.value })}
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-5 py-2.5 bg-gov-600 hover:bg-gov-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
                  >
                    {editingSchemeId ? "Update Scheme" : "Publish Scheme"}
                  </button>
                  {editingSchemeId && (
                    <button
                      type="button"
                      onClick={resetSchemeForm}
                      className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </GlassCard>

            <GlassCard hoverEffect={false} className="p-4 font-sans text-xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
                Active Government Schemes ({schemes.length})
              </h3>
              <div className="space-y-3">
                {schemes.map((scheme) => (
                  <div key={scheme.id} className="flex justify-between items-start gap-4 p-3 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <h4 className="font-bold text-slate-950 dark:text-white">{scheme.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{scheme.category} · {scheme.documents?.length || 0} required docs · {scheme.villageId === "all" ? "All Villages" : scheme.villageId}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setEditingSchemeId(scheme.id);
                          setSchemeForm({
                            name: scheme.name,
                            nameTe: scheme.nameTe || "",
                            category: scheme.category,
                            benefits: scheme.benefits || "",
                            benefitsTe: scheme.benefitsTe || "",
                            eligibility: scheme.eligibility,
                            eligibilityTe: scheme.eligibilityTe || "",
                            documents: (scheme.documents || []).join("\n"),
                            steps: (scheme.steps || []).join("\n"),
                            officialUrl: scheme.officialUrl || "",
                            villageId: scheme.villageId || "all",
                          });
                        }}
                        className="p-1 px-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteScheme(scheme.id, scheme.name)}
                        className="p-1 px-2.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        )}

        {/* TAB 5: GALLERY COMPONENT */}
        {activeTab === "gallery" && (
          <div className="space-y-6">
            <GlassCard hoverEffect={false}>
              <form onSubmit={handleAddGallerySubmit} className="space-y-4 text-xs font-sans">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800 uppercase tracking-wider">
                  {language === "te" ? "గ్యాలరీ ఆల్బమ్‌లో కొత్త ఫోటో చేర్చండి" : "Post New Photograph to Public Album"}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 col-span-2">
                    <label className="font-bold text-slate-500">{language === "te" ? "చిత్రం URL లింక్" : "Image URL Link"}</label>
                    <input
                      required
                      type="text"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl dark:text-white"
                      placeholder="Paste Unsplash or base64 data link..."
                      value={newGal.imageUrl}
                      onChange={(e) => setNewGal({ ...newGal, imageUrl: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">{language === "te" ? "శీర్షిక / వివరణ" : "Caption / Title"}</label>
                    <input
                      required
                      type="text"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl dark:text-white"
                      value={newGal.title}
                      onChange={(e) => setNewGal({ ...newGal, title: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">{language === "te" ? "క్యాటగిరి విభాగం" : "Album Classification"}</label>
                    <select
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl dark:text-white"
                      value={newGal.category}
                      onChange={(e) => setNewGal({ ...newGal, category: e.target.value })}
                    >
                      <option value="Admin">Council & Admin</option>
                      <option value="Agriculture">Agriculture</option>
                      <option value="Schools">Schools & Anganwadi</option>
                      <option value="Infrastructure">Infrastructure</option>
                      <option value="Events">Annual Events</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 bg-gov-600 hover:bg-gov-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  {language === "te" ? "ఫోటో అప్‌లోడ్ చేయండి" : "Upload Photograph"}
                </button>
              </form>
            </GlassCard>

            {/* List images */}
            <GlassCard hoverEffect={false} className="p-4 font-sans text-xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
                {language === "te" ? "గ్యాలరీ చిత్రాలు" : "Panchayat Album Images"}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {data.gallery.map((g) => (
                  <div key={g.id} className="relative rounded-xl overflow-hidden border border-slate-105 group">
                    <img src={g.imageUrl} alt={g.title} className="w-full h-24 object-cover" />
                    <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200">
                      <button
                        onClick={() => handleDeleteGal(g.id)}
                        className="p-1 px-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg cursor-pointer"
                      >
                        {language === "te" ? "తొలగించు" : "Delete"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        )}

        {/* TAB 6: CITIZEN GRIEVANCE TICKETS */}
        {activeTab === "complaints" && (
          <GlassCard hoverEffect={false} className="space-y-4">
            <h3 className="text-base font-display font-medium text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
              {language === "te" ? "క్రియాశీల పౌర సమస్యల అభ్యర్థనలు (Grievance Tickets)" : "Active Grievance/Complaint Tickets"}
            </h3>

            <div className="space-y-4 font-sans text-xs">
              {messages.length > 0 ? (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-4 border rounded-2xl space-y-3 transition ${
                      msg.status === "unread"
                        ? "bg-rose-50/20 dark:bg-rose-950/10 border-rose-100/50"
                        : "bg-slate-50/55 dark:bg-slate-900/40 border-slate-205/50"
                    }`}
                  >
                    <div className="flex flex-wrap justify-between gap-2 items-center">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">{msg.name}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Contact: +91 {msg.phone} | email: {msg.email || "N/A"}</span>
                      </div>

                      <div className="flex gap-2 items-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                          msg.status === "unread"
                            ? "bg-rose-100 text-rose-800"
                            : msg.status === "read"
                            ? "bg-slate-100 text-slate-600"
                            : "bg-emerald-100 text-emerald-800"
                        }`}>
                          {msg.status}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{msg.date}</span>
                      </div>
                    </div>

                    <p className="text-[13px] bg-white dark:bg-slate-900 p-3 rounded-xl leading-relaxed text-slate-700 dark:text-slate-450">
                      {msg.message}
                    </p>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">
                        {language === "te" ? "సచివాలయ అధికారి స్పందన / రిమార్క్స్" : "Official Sachivalayam Reply / Remarks"}
                      </label>
                      <input
                        type="text"
                        placeholder={language === "te" ? "పౌరుడికి చూపించే సమాధానం రాయండి..." : "Write status update or instructions visible to citizen..."}
                        value={remarksDrafts[msg.id] ?? msg.adminRemarks ?? ""}
                        onChange={(e) => setRemarksDrafts((prev) => ({ ...prev, [msg.id]: e.target.value }))}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs dark:text-white"
                      />
                    </div>

                    <div className="flex justify-end gap-2 text-[11px] font-bold">
                      {msg.status === "unread" && (
                        <button
                          onClick={() => handleUpdateComplaintStatus(msg.id, "read")}
                          className="px-3 py-1 bg-slate-100 text-slate-750 hover:bg-slate-200 rounded-lg cursor-pointer"
                        >
                          {language === "te" ? "చూసినట్లు గుర్తించు" : "Mark Viewed"}
                        </button>
                      )}
                      {msg.status !== "resolved" && (
                        <button
                          onClick={() => handleUpdateComplaintStatus(msg.id, "resolved")}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer flex items-center gap-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          {language === "te" ? "పరిష్కరించు" : "Resolve"}
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteComplaint(msg.id)}
                        className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg cursor-pointer"
                      >
                        {language === "te" ? "టికెట్ తొలగించు" : "Delete Ticket"}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-450 text-center py-8">
                  {language === "te" ? "నివాసితుల నుండి ఎలాంటి అర్జీలు నమోదు కాలేదు." : "No complaints logged yet by any citizen."}
                </p>
              )}
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
};
