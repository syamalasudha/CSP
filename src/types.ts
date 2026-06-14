/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface VillageStats {
  population: number;
  areaSqKm: number;
  totalWards: number;
  totalHouseholds: number;
}

export interface Official {
  designation: string;
  name: string;
  contact?: string;
}

export interface WardMember {
  ward: number;
  name: string;
  contact: string;
}

export interface VotersDetail {
  totalPollingStations: number;
  maleVoters: number;
  femaleVoters: number;
  bcVoters: number;
  scVoters: number;
  stVoters: number;
  totalVoters: number;
}

export interface StaffMember {
  id: string;
  name: string;
  designation: string;
  contact: string;
  department: 'Panchayat' | 'Sachivalayam' | 'Anganwadi' | 'Health' | 'VOA';
}

export interface LandDetail {
  totalAayakattuAcres: number;
  wetLandAcres: number;
  dryLandAcres: number;
  porambokuAcres: number;
  fisheriesAcres: number;
  assignedAcres: number;
  endowmentsAcres: number;
  totalSurveyNumbers: number;
  totalKhathas: number;
}

export interface EducationDetail {
  govtSchools: number;
  highSchools: number;
  anganwadiCenters: number;
}

export interface HealthSanitationDetail {
  hasWellnessCentre: boolean;
  ashaWorkers: number;
  anms: number;
  swpcSheds: number;
  clapmitras: number;
  sweepers: number;
  tricycles: number;
}

export interface DrinkingWaterDetail {
  source: string;
  overheadTankLitres: number;
  supplyPerHeadLitresDay: number;
  publicTaps: number;
  privateTaps: number;
}

export interface RationDetail {
  fairPriceShops: number;
  riceCards: number;
}

export interface SHGDetail {
  totalGroups: number;
  groupsWithBankLoans: number;
  totalLoanAmountLakhs: number;
}

export interface PensionDetail {
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

export interface InfrastructureDetail {
  ledStreetLights: number;
  ccmsBoxes: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'General' | 'Welfare' | 'Meeting' | 'Alert';
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Infrastructure' | 'Events' | 'Schools' | 'Agriculture' | 'Admin';
  imageUrl: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'unread' | 'read' | 'resolved';
  date: string;
}

export interface DatabaseSchema {
  stats: VillageStats;
  officials: Official[];
  wardMembers: WardMember[];
  voters: VotersDetail;
  staff: StaffMember[];
  land: LandDetail;
  education: EducationDetail;
  health: HealthSanitationDetail;
  water: DrinkingWaterDetail;
  ration: RationDetail;
  shg: SHGDetail;
  pensions: PensionDetail;
  infrastructure: InfrastructureDetail;
  announcements: Announcement[];
  gallery: GalleryItem[];
  messages: ContactMessage[];
}
