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
  publicCommonAcres: number;
  fisheriesAcres: number;
  assignedAcres: number;
  endowmentsAcres: number;
  totalSurveyNumbers: number;
  totalKhathas: number;
}

export interface EducationDetail {
  govtSchools: number | null;
  highSchools: number | null;
  anganwadiCenters: number | null;
  elementarySchools?: number | null;
  juniorColleges?: number | null;
  trainingCentres?: string | null;
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
  source: string | null;
  overheadTankLitres: number | null;
  supplyPerHeadLitresDay: number | null;
  publicTaps: number | null;
  privateTaps: number | null;
  ssTankCapacityMl?: number | null;
  ssTankAreaAcres?: number | null;
  filterBedCapacityMld?: number | null;
  distributionLineLengthKm?: number | null;
  householdsCoveredByPipedWater?: number | null;
  areaCoveredByPipedWaterPercent?: number | null;
  uncoveredHouseholds?: number | null;
  uncoveredAreaPercent?: number | null;
  householdsCoveredThroughTransportation?: number | null;
  waterSupplyFrequency?: string | null;
  supplyDurationHours?: number | null;
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

export interface LocationDetail {
  pinCode?: string;
  villageCode?: string;
  nearestTown?: string;
  distanceToNearestTownKm?: number;
  distanceToDistrictHqKm?: number;
  distanceToMandalHqKm?: number;
  sachivalayamCode?: string;
  latitude?: number;
  longitude?: number;
  distanceToStateCapitalKm?: number;
  distanceToAirportKm?: number;
  nearestAirport?: string;
  distanceToSeaportKm?: number;
  nearestSeaport?: string;
  nearestRiver?: string;
  distanceToRiverKm?: number;
  nearestNationalHighway?: string;
  distanceToNationalHighwayKm?: number;
  nearestTouristPlace?: string;
  distanceToTouristPlaceKm?: number;
  nearestUniversity?: string;
}

export interface DemographicsDetail {
  malePopulation: number | null;
  femalePopulation: number | null;
  sexRatio: number | null;
  children0to6: number | null;
  workingPopulation: number | null;
  mainWorkers: number | null;
  marginalWorkers: number | null;
  scPopulation?: number | null;
  stPopulation?: number | null;
}

export interface HospitalDetail {
  government: number | null;
  private: number | null;
  total: number | null;
}

export interface HospitalsDetailed {
  municipal?: {
    allopathic?: number | null;
    homeopathic?: number | null;
    ayurvedic?: number | null;
    unani?: number | null;
    veterinary?: number | null;
    total?: number | null;
  };
  government?: {
    allopathic?: number | null;
    veterinary?: number | null;
    total?: number | null;
  };
  private?: {
    allopathic?: number | null;
    total?: number | null;
  };
  total?: {
    allopathic?: number | null;
    veterinary?: number | null;
    total?: number | null;
  };
}

export interface SocialCategories {
  scPopulation?: number | null;
  stPopulation?: number | null;
}

export interface EducationDetailed {
  schools?: {
    zpMpElementary?: number | null;
    zpMpUpperPrimary?: number | null;
    zpMpHighSchools?: number | null;
    privateHighSchools?: number | null;
    totalSchools?: number | null;
  };
  colleges?: {
    governmentJuniorColleges?: number | null;
    privateDegreeColleges?: number | null;
    totalColleges?: number | null;
  };
  trainingCentres?: {
    drda?: number | null;
    icds?: number | null;
    dtc?: number | null;
    bankers?: number | null;
    computerCentres?: number | null;
    others?: number | null;
  };
}

export interface MarketsDetail {
  vegetableMarkets?: number | null;
  fruitMarkets?: number | null;
  flowerMarkets?: number | null;
  rythuBazars?: number | null;
  muttonMarkets?: number | null;
  fishMarkets?: number | null;
  others?: number | null;
  totalMarkets?: number | null;
}

export interface BurialGroundsDetail {
  hindu?: number | null;
  muslim?: number | null;
  christian?: number | null;
  others?: number | null;
  total?: number | null;
}

export interface ParksDetail {
  totalParks?: number | null;
}

export interface WaterBodiesDetail {
  municipalTanks?: number | null;
  governmentTanks?: number | null;
  otherTanks?: number | null;
  totalTanks?: number | null;
}

export interface StreetLightsDetail {
  highMastJunctions?: number | null;
  svLamps?: number | null;
  mvLamps?: number | null;
  tubeLights?: number | null;
  solarLights?: number | null;
  ledLights?: number | null;
  totalLights?: number | null;
  polesWithoutLights?: number | null;
}

export interface TradeDetail {
  doTrades?: number | null;
  doTradeDemand?: number | null;
  hotels?: number | null;
  lodges?: number | null;
  theatres?: number | null;
  functionHalls?: number | null;
  fireStations?: number | null;
}

export interface PlanningDetail {
  approvedLayoutPlans?: number | null;
  layoutOpenSpaces?: number | null;
}

export interface SanitationDetail {
  permanentWorkers: number | null;
  contractWorkers: number | null;
  communityToilets: number | null;
  publicToilets: number | null;
  householdsWithToilets: number | null;
  householdsWithoutToilets: number | null;
}

export interface RevenueDetail {
  propertyTaxAssessments: number | null;
  propertyTaxDemandLakhs: number | null;
  nonTaxDemandLakhs: number | null;
  totalDemandLakhs: number | null;
  marketRevenueLakhs: number | null;
}

export interface RoadsDetail {
  municipalRoadsKm?: any;
  rbRoadsKm?: any;
  nationalHighwaysKm?: number | null;
  threeArmedJunctions?: number | null;
  fourArmedJunctions?: number | null;
  majorDrainsLength?: number | null;
  minorDrainsLength?: number | null;
  totalDrainLength?: number | null;
}

export interface FacilitiesDetail {
  crcCentres?: number | null;
  mahilaSwasakthiBhavans?: number | null;
  meeSevaCentres?: number | null;
  bankBranches?: number | null;
  hotels?: number | null;
  lodges?: number | null;
  theatres?: number | null;
  functionHalls?: number | null;
  fireStations?: number | null;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'General' | 'Welfare' | 'Meeting' | 'Alert';
}

export interface AboutDetail {
  history_p1: string;
  history_p2: string;
  landscape_p1: string;
  landscape_p2: string;
  vision_p1: string;
  history_p1_te?: string;
  history_p2_te?: string;
  landscape_p1_te?: string;
  landscape_p2_te?: string;
  vision_p1_te?: string;
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
  id: string;
  name: string;
  nameTe: string;
  mandal: string;
  mandalTe: string;
  district: string;
  districtTe: string;
  type?: string;
  grade?: string;
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
  location?: LocationDetail;
  demographics?: DemographicsDetail;
  hospitals?: HospitalsDetailed | HospitalDetail;
  socialCategories?: SocialCategories;
  educationDetailed?: EducationDetailed;
  markets?: MarketsDetail;
  burialGrounds?: BurialGroundsDetail;
  parks?: ParksDetail;
  waterBodies?: WaterBodiesDetail;
  streetLights?: StreetLightsDetail;
  trade?: TradeDetail;
  planning?: PlanningDetail;
  sanitation?: SanitationDetail;
  revenue?: RevenueDetail;
  roads?: RoadsDetail;
  facilities?: FacilitiesDetail;
  announcements: Announcement[];
  gallery: GalleryItem[];
  messages: ContactMessage[];
  about?: AboutDetail;
}
