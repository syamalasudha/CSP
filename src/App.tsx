/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { ThemeProvider } from "./components/ThemeContext";
import { LanguageProvider } from "./components/LanguageContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ToastContainer, Toast, GlassCard } from "./components/UIComponents";
import { VillageSelector, VillageInfo } from "./components/VillageSelector";
import { DatabaseSchema } from "./types";
import { Certificates } from "./pages/Certificates";

// Import modular pages
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Administration } from "./pages/Administration";
import { Directory } from "./pages/Directory";
import { Infrastructure } from "./pages/Infrastructure";
import { Welfare } from "./pages/Welfare";
import { Voters } from "./pages/Voters";
import { Gallery } from "./pages/Gallery";
import { Contact } from "./pages/Contact";
import { Admin } from "./pages/Admin";
import { Loader2, Landmark, ArrowLeftRight } from "lucide-react";

const VILLAGE_KEY = "csp-selected-village";

export default function App() {
  const [selectedVillage, setSelectedVillage] = useState<VillageInfo | null>(() => {
    try {
      const saved = localStorage.getItem(VILLAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activePage, setActivePage] = useState<string>("home");
  const [portalData, setPortalData] = useState<DatabaseSchema | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem("vendra-portal-admin-token");
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (type: "success" | "error" | "info", message: string) => {
    const id = "toast-" + Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => removeToast(id), 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Handle village selection
  const handleVillageSelect = (village: VillageInfo) => {
    setSelectedVillage(village);
    localStorage.setItem(VILLAGE_KEY, JSON.stringify(village));
    setPortalData(null);
    setActivePage("home");
  };

  // Switch village — clears selection and goes back to selector
  const handleSwitchVillage = () => {
    setSelectedVillage(null);
    localStorage.removeItem(VILLAGE_KEY);
    setPortalData(null);
    setActivePage("home");
  };

  // Sync hash routing
  useEffect(() => {
    const supportedPages = [
      "home", "about", "admin-details", "staff",
      "citizen-services", "agriculture", "welfare",
      "voters", "gallery", "contact", "admin",
    ];
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (supportedPages.includes(hash)) {
        setActivePage(hash);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setActivePage("home");
      }
    };
    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Fetch portal data once village is selected
  const fetchPortalData = async () => {
    if (!selectedVillage) return;
    setLoading(true);
    try {
      // Load local db.json and pick the selected village by id or name
      const res = await fetch("/db.json");
      if (!res.ok) throw new Error("Could not fetch db.json");
      const json = await res.json();
      const villages: any[] = json.villages || [];
      const match = villages.find((v) => v.id === selectedVillage.id || v.name === selectedVillage.name || v.nameTe === selectedVillage.nameTe);
      if (!match) throw new Error("Selected village data not found in db.json");
      setPortalData(match as any);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed loading council records. Check Express backend connectivity.";
      addToast("error", message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedVillage) {
      fetchPortalData();
    }
  }, [selectedVillage]);

  const handleAdminLogin = (token: string) => {
    setAdminToken(token);
    localStorage.setItem("vendra-portal-admin-token", token);
  };

  const handleAdminLogout = () => {
    setAdminToken(null);
    localStorage.removeItem("vendra-portal-admin-token");
    addToast("info", "Admin session dismissed successfully.");
    setActivePage("home");
    window.location.hash = "home";
  };

  const renderActivePage = () => {
    if (!portalData) return null;

    switch (activePage) {
      case "home":
        return (
          <Home
            data={portalData}
            onNavigate={(p) => {
              setActivePage(p);
              window.location.hash = p;
            }}
          />
        );
      case "about":
        return <About data={portalData} />;
      case "admin-details":
        return (
          <Administration
            data={portalData}
            onActionClick={(msg) => addToast("success", msg)}
          />
        );
      case "staff":
        return (
          <Directory
            data={portalData}
            onActionClick={(msg) => addToast("success", msg)}
          />
        );
      case "citizen-services":
        return <Certificates />;
      case "agriculture":
        return <Infrastructure data={portalData} />;
      case "welfare":
        return <Welfare data={portalData} />;
      case "voters":
        return <Voters data={portalData} />;
      case "gallery":
        return <Gallery data={portalData} />;
      case "contact":
        return (
          <Contact
            onSuccess={(m) => addToast("success", m)}
            onError={(m) => addToast("error", m)}
            onNavigateHome={() => {
              setActivePage("home");
              window.location.hash = "home";
            }}
          />
        );
      case "admin":
        return (
          <Admin
            data={portalData}
            token={adminToken}
            onLoginSuccess={handleAdminLogin}
            onRefreshData={fetchPortalData}
            onToastSuccess={(m) => addToast("success", m)}
            onToastError={(m) => addToast("error", m)}
          />
        );
      default:
        return (
          <Home
            data={portalData}
            onNavigate={(p) => setActivePage(p)}
          />
        );
    }
  };

  // Show village selector if no village chosen yet
  if (!selectedVillage) {
    return <VillageSelector onSelect={handleVillageSelect} />;
  }

  return (
    <LanguageProvider>
      <ThemeProvider>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
          <Navbar
            activePage={activePage}
            setActivePage={setActivePage}
            isAdminLoggedIn={!!adminToken}
            onLogout={handleAdminLogout}
            selectedVillage={selectedVillage}
            onSwitchVillage={handleSwitchVillage}
          />

          {loading ? (
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-20 flex flex-col justify-center items-center gap-4">
              <div className="p-4 bg-white dark:bg-slate-900 rounded-full shadow-lg flex items-center justify-center text-gov-600 animate-spin">
                <Loader2 className="w-8 h-8" />
              </div>
              <p className="text-sm font-semibold tracking-wide text-slate-500 font-sans">
                Connecting to {selectedVillage.name} Secretariat database...
              </p>
            </main>
          ) : (
            <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
              <div className="animate-fade-in">{renderActivePage()}</div>
            </main>
          )}

          <Footer selectedVillage={selectedVillage} />
          <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
      </ThemeProvider>
    </LanguageProvider>
  );
}
