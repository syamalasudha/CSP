/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useLanguage } from "../components/LanguageContext";
import { SectionHeading, GlassCard } from "../components/UIComponents";
import { Eye, X, Image as ImageIcon } from "lucide-react";
import { DatabaseSchema, GalleryItem } from "../types";

export const Gallery: React.FC<{ data: DatabaseSchema }> = ({ data }) => {
  const { language, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const categories = ["All", "Admin", "Agriculture", "Schools", "Infrastructure", "Events"];

  const getLocalizedCategoryName = (cat: string) => {
    switch (cat) {
      case "All": return language === "te" ? "అన్నీ" : "All";
      case "Admin": return language === "te" ? "పరిపాలన" : "Admin";
      case "Agriculture": return language === "te" ? "వ్యవసాయం" : "Agriculture";
      case "Schools": return language === "te" ? "పాఠశాలలు" : "Schools";
      case "Infrastructure": return language === "te" ? "మౌలిక వసతులు" : "Infrastructure";
      case "Events": return language === "te" ? "కార్యక్రమాలు" : "Events";
      default: return cat;
    }
  };

  const getLocalizedImageTitle = (item: GalleryItem) => {
    if (language !== "te") return item.title;
    // Localize the gallery items in our mock database
    const villageName = data.nameTe || data.name || "గ్రామ";
    if (item.title.includes("Sachivalayam")) return `${villageName} డిజిటల్ గ్రామ సచివాలయ భవనం`;
    if (item.title.includes("Overhead Clean Water")) return "మంచి నీటి ఓవర్‌హెడ్ రిజర్వాయర్ ట్యాంక్ (1.2 లక్షల లీటర్లు)";
    if (item.title.includes("Gram Sabha")) return `గ్రామ సభ సమావేశంలో చర్చలు - ${villageName}`;
    if (item.title.includes("Paddy Harvest")) return `${villageName} పొలాలలో వరి కోతల ఉత్సవం`;
    if (item.title.includes("Smart Classrooms")) return "ప్రభుత్వ హైస్కూలు డిజిటల్ స్మార్ట్ తరగతి గది";
    if (item.title.includes("Health Screening")) return "సచివాలయ వైఎస్ఆర్ క్లినిక్ ఆరోగ్య శిబిరం";
    return item.title;
  };

  const filteredGallery = data.gallery.filter((item: GalleryItem) => {
    return activeCategory === "All" || item.category === activeCategory;
  });

  return (
    <div className="space-y-12">
      <SectionHeading
        badge={t("nav_gallery")}
        title={t("gallery_title")}
        subtitle={t("gallery_subtitle")}
      />

      {/* Tabs Row */}
      <div className="flex flex-wrap gap-2 justify-center border-b border-slate-205 dark:border-slate-800 pb-5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold transition border cursor-pointer ${
              activeCategory === cat
                ? "bg-gov-600 text-white border-transparent shadow shadow-gov-600/10"
                : "bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 border-slate-200/50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-805"
            }`}
          >
            {getLocalizedCategoryName(cat)}
          </button>
        ))}
      </div>

      {/* Pictures Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGallery.length > 0 ? (
          filteredGallery.map((item: GalleryItem) => (
            <div
              key={item.id}
              className="group relative rounded-2xl overflow-hidden shadow-sm border border-slate-200/20 dark:border-slate-800 h-64 bg-slate-900 cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:border-gov-600/25"
              onClick={() => setSelectedImage(item)}
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover opacity-85 group-hover:opacity-60 transition duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-5 flex flex-col justify-end h-1/2">
                <span className="text-[10px] text-gov-400 font-bold uppercase tracking-wider font-display mb-1.5 bg-gov-600/20 w-fit px-2 py-0.5 rounded border border-gov-500/10">
                  {getLocalizedCategoryName(item.category)}
                </span>
                <h4 className="text-sm font-bold text-white tracking-wide truncate">
                  {getLocalizedImageTitle(item)}
                </h4>
              </div>

              {/* View Overlay icon indicator */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition duration-300">
                <span className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white">
                  <Eye className="w-5 h-5" />
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-slate-400">
            <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm">
              {language === "te" ? `"${getLocalizedCategoryName(activeCategory)}" విభాగంలో ఎలాంటి చిత్రాలు లభించలేదు.` : `No photo records categorized as "${activeCategory}" yet.`}
            </p>
          </div>
        )}
      </div>

      {/* LIGHTBOX MODAL PREVIEW */}
      {selectedImage && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/95 flex items-center justify-center p-4 backdrop-blur-sm">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-5 right-5 p-3 bg-white/5 hover:bg-white/15 hover:text-white rounded-full text-slate-400 transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-4xl w-full flex flex-col items-center gap-4">
            <div className="relative rounded-2xl overflow-hidden bg-slate-900 max-h-[75vh] flex justify-center items-center">
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.title}
                className="max-h-[75vh] w-auto max-w-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-center text-white px-2 mt-2">
              <span className="inline-block px-2.5 py-0.5 rounded bg-gov-600 text-[10px] uppercase font-bold tracking-widest max-w-fit mb-2">
                {getLocalizedCategoryName(selectedImage.category)}
              </span>
              <h3 className="text-base md:text-lg font-display tracking-wide font-semibold">
                {getLocalizedImageTitle(selectedImage)}
              </h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
