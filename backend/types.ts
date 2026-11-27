/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Official {
  designation: string;
  name: string;
  nameTe: string;
  category?: string;
  contact?: string;
}

export interface WardMember {
  ward: number | string;
  name: string;
  nameTe: string;
  category?: string;
  contact: string;
}

export interface StaffMember {
  id: string;
  name: string;
  designation: string;
  contact: string;
  department: "Panchayat" | "Sachivalayam" | "Anganwadi" | "Health" | "VOA";
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  category: "General" | "Welfare" | "Meeting" | "Alert";
}

export interface GalleryItem {
  id: string;
  title: string;
  category: "Infrastructure" | "Events" | "Schools" | "Agriculture" | "Admin";
  imageUrl: string;
}

export interface DatabaseSchema {
  id: string;
  name: string;
  nameTe: string;
  mandal: string;
  mandalTe: string;
  district: string;
  districtTe: string;
  type?: string;
  grade?: string;
  stats: Record<string, any>;
  officials: Official[];
  wardMembers: WardMember[];
  voters: Record<string, any>;
  staff: StaffMember[];
  land: Record<string, any>;
  education: Record<string, any>;
  health: Record<string, any>;
  water: Record<string, any>;
  ration: Record<string, any>;
  shg: Record<string, any>;
  pensions: Record<string, any>;
  infrastructure: Record<string, any>;
  location?: Record<string, any>;
  demographics?: Record<string, any>;
  hospitals?: Record<string, any>;
  socialCategories?: Record<string, any>;
  educationDetailed?: Record<string, any>;
  markets?: Record<string, any>;
  burialGrounds?: Record<string, any>;
  parks?: Record<string, any>;
  waterBodies?: Record<string, any>;
  streetLights?: Record<string, any>;
  trade?: Record<string, any>;
  planning?: Record<string, any>;
  sanitation?: Record<string, any>;
  revenue?: Record<string, any>;
  roads?: Record<string, any>;
  facilities?: Record<string, any>;
  communication?: Record<string, any>;
  announcements: Announcement[];
  gallery: GalleryItem[];
  messages: Record<string, any>[];
  about?: Record<string, any>;
}

