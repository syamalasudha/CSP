/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from "react";
import { useLanguage } from "../components/LanguageContext";
import { SectionHeading, GlassCard } from "../components/UIComponents";
import { Phone, Mail, MapPin, Send, HelpCircle, Check, Loader2 } from "lucide-react";

interface ContactProps {
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
  onNavigateHome: () => void;
}

import { API_BASE, apiUrl } from "../config/api";

export const Contact: React.FC<ContactProps> = ({ onSuccess, onError, onNavigateHome }) => {
  const { language, t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      onError(language === "te" ? "దయచేసి అన్ని తప్పనిసరి ఫీల్డ్‌లను పూరించండి (పేరు, ఫోన్ మరియు సందేశం)." : "Please fill in all required fields (Name, Phone, and Message).");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(apiUrl("/api/messages"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to submit query");
      }

      setSubmitted(true);
      onSuccess(language === "te" ? "ఫిర్యాదు / సమస్య సచివాలయ రిజిస్ట్రీలో విజయవంతంగా దాఖలు చేయబడింది!" : "Complaint / Query lodged successfully in public secretariat!");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      const message = err instanceof Error ? err.message : (language === "te" ? "సమర్పణ సమయంలో ఏదో పొరపాటు జరిగింది. దయచేసి మళ్లీ ప్రయత్నించండి." : "Something went wrong during submission. Please try again.");
      onError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <SectionHeading
        badge={t("nav_contact")}
        title={t("contact_title")}
        subtitle={t("contact_subtitle")}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Helpdesk Contacts Col */}
        <div className="lg:col-span-5 space-y-6">
          <GlassCard hoverEffect={false} className="space-y-4 font-sans">
            <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              {language === "te" ? "పరిపాలనా సహాయ పీఠం" : "Administrative Helpdesk"}
            </h3>

            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex gap-3 items-start">
                <MapPin className="w-5 h-5 text-gov-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block font-display">
                    {language === "te" ? "కార్యాలయ చిరునామా" : "Office Address"}
                  </span>
                  <span>{t("office_address_val")}</span>
                </div>
              </li>

              <li className="flex gap-3 items-start">
                <Phone className="w-5 h-5 text-gov-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block font-display">
                    {language === "te" ? "సచివాలయ సహాయ కేంద్రం" : "Secretary Call desk"}
                  </span>
                  <span>+91-9573930799 ({language === "te" ? "ఉదయం 10:00 నుండి సాయంత్రం 5:00 వరకు" : "Office hours 10 AM - 5 PM"})</span>
                </div>
              </li>

              <li className="flex gap-3 items-start">
                <Mail className="w-5 h-5 text-gov-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block font-display">
                    {language === "te" ? "ఇమెయిల్ సేవ" : "Email Service"}
                  </span>
                  <span>vendra.panchayat@ap.gov.in</span>
                </div>
              </li>
            </ul>
          </GlassCard>

          <GlassCard hoverEffect={false} className="space-y-3.5 bg-slate-50 dark:bg-slate-900/40 border-l-4 border-l-amber-500">
            <h4 className="text-sm font-display font-bold text-slate-900 dark:text-white flex items-center gap-1.5 leading-none">
              <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
              {language === "te" ? "సచివాలయ ఫిర్యాదుల విధానం" : "Sachivalayam Grievance Policy"}
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              {language === "te"
                ? "దాఖలైన ప్రతి ఫిర్యాదు సమయముద్రతో (Timestamp) నమోదు చేయబడుతుంది మరియు తగిన వార్డు కార్యదర్శికి మళ్ళించబడుతుంది. మా సగటు పరిష్కార సమయం 48 గంటలు."
                : "Every complaint is logged with a timestamp and routed to the corresponding ward secretary. Our median response and resolution cycle for non-structural disputes stands at 48 hours."}
            </p>
          </GlassCard>
        </div>

        {/* Complaint Lodging form Col */}
        <div className="lg:col-span-7">
          <GlassCard hoverEffect={false}>
            {submitted ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-md">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-display font-black text-slate-900 dark:text-white">
                  {language === "te" ? "రోగ్ రికార్డు విజయవంతం!" : "Ticket Lodged Successfully!"}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-sans leading-relaxed">
                  {language === "te"
                    ? "మీ ఫిర్యాదు సచివాలయంలో నమోదు చేయబడింది. మా ఉద్యోగులు త్వరలోనే దీనిని పరిశీలిస్తారు."
                    : "Your ticket is listed in the Sachivalayam complaints workflow. Digital assistant staff will verify your details soon."}
                </p>
                <div className="pt-4 flex justify-center gap-4">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-350 rounded-xl transition cursor-pointer"
                  >
                    {language === "te" ? "మరో విన్నపం సమర్పించండి" : "Submit Another Query"}
                  </button>
                  <button
                    onClick={onNavigateHome}
                    className="px-4 py-2 bg-gov-600 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    {language === "te" ? "హోమ్ పేజీకి వెళ్లండి" : "Go Back Home"}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 text-sm">
                <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                  {language === "te" ? "గ్రామ సచివాలయ ఫిర్యాదు పత్రం" : "Panchayat Grievance Form"}
                </h3>

                <div className="space-y-4">
                  {/* Name field */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">
                      {language === "te" ? "పూర్తి పేరు" : "Full Name"} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-gov-600 focus:border-transparent transition"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={language === "te" ? "మీ పూర్తి పేరు రాయండి" : "Enter your registered name"}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Phone field */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">
                        {language === "te" ? "ఫోన్ నెంబర్" : "Active Phone"} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        required
                        type="tel"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-gov-600 focus:border-transparent transition"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. 9849xxxxxx"
                      />
                    </div>

                    {/* Email field */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">
                        {language === "te" ? "ఇమెయిల్ చిరునామా (ఐచ్ఛికం)" : "Email Address (Optional)"}
                      </label>
                      <input
                        type="email"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-gov-600 focus:border-transparent transition"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. resident@example.com"
                      />
                    </div>
                  </div>

                  {/* Message / Complaint field */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">
                      {language === "te" ? "ఫిర్యాదు వివరణ" : "Grievance Description"} <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-gov-600 focus:border-transparent transition resize-none"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={language === "te" ? "మీ సమస్య, వార్డు మరియు పరిష్కార వివరాలను స్పష్టంగా ఇక్కడ తెలియజేయండి." : "Please clearly describe your issue, village area/ward, and desired resolution details."}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gov-600 hover:bg-gov-700 text-white font-bold rounded-xl transition shadow flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {language === "te" ? "ఫిర్యాదు దాఖలవుతోంది..." : "Latching Ticket into System..."}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {language === "te" ? "సమస్య నమోదు చేయండి" : "Lodge Complaint Ticket"}
                    </>
                  )}
                </button>
              </form>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
