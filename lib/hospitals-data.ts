/**
 * Swasthya Setu — curated hospital/doctor/clinic dataset.
 *
 * SOURCE NOTE (read before editing):
 * - This file is a hand-curated directory of well-known, real facilities.
 * - Facility names, cities/areas and specialties are public knowledge
 *   (major govt hospitals, AIIMS/PGIMER/JIPMER/NIMHANS, well-known private
 *   chains, plus the Rajkot entries previously provided in this repo's
 *   `lib/supabase/seed_real.sql`, which came from a user-supplied table).
 * - Phone numbers, street addresses, ratings, review counts, distances and
 *   queue times are DELIBERATELY OMITTED — they were previously invented
 *   placeholders. Unknown contact info renders as "Contact via hospital".
 * - Doctor names below are taken from the repo's own seed file (user-provided
 *   table), NOT independently verified. No fees, ratings or availability are
 *   claimed for them.
 * - `emergency: true` means the facility is widely known to run a 24/7
 *   emergency/casualty department. For small clinics/PHCs/CHCs this is set to
 *   false (unverified) — assume nothing.
 * - For live ratings, distances, phone numbers or OPD slots, an external API
 *   (e.g. Google Places) would be needed. Nothing here is a substitute.
 */

export type FacilityType = "Govt" | "Private" | "Clinic";

export interface Facility {
  id: string;
  name: string;
  type: FacilityType;
  city: string;
  area: string;
  specialties: string[];
  emergency: boolean;
  /** Area-level location only (e.g. "Asarwa, Ahmedabad"). Omit when unsure. */
  address?: string;
  note?: string;
}

export interface DoctorEntry {
  id: string;
  name: string;
  specialty: string;
  /** Facility id in this file, or null when the practice location is unverified. */
  hospitalId: string | null;
  hospitalName: string;
  note?: string;
}

export const DATA_SOURCE_NOTE =
  "Curated static directory (lib/hospitals-data.ts). Names/cities/specialties are public knowledge or from the repo's user-provided seed; contacts, ratings and distances are omitted, not invented.";

export const SPECIALTIES = [
  "Cardiology",
  "Cardiac Surgery",
  "Neurology",
  "Neurosurgery",
  "Orthopedics",
  "Joint Replacement",
  "Oncology",
  "Pediatrics",
  "Obstetrics",
  "Gynecology",
  "General Medicine",
  "Internal Medicine",
  "General Surgery",
  "Gastroenterology",
  "Nephrology",
  "Urology",
  "Ophthalmology",
  "Cataract Surgery",
  "ENT",
  "Dental",
  "Dermatology",
  "Psychiatry",
  "Emergency Medicine",
  "Primary Care",
  "Kidney Transplant",
  "Radiation Therapy",
  "Dialysis",
  "Immunisation",
] as const;

export const CITIES = [
  "Ahmedabad",
  "Rajkot",
  "Vadodara",
  "Surat",
  "Bhavnagar",
  "Gondal",
  "New Delhi",
  "Mumbai",
  "Bengaluru",
  "Chennai",
  "Vellore",
  "Madurai",
  "Gurugram",
  "Chandigarh",
  "Puducherry",
] as const;

export const HOSPITALS: Facility[] = [
  // ---------- Ahmedabad / Gujarat — major hospitals ----------
  {
    id: "ahd-civil",
    name: "Civil Hospital, Ahmedabad",
    type: "Govt",
    city: "Ahmedabad",
    area: "Asarwa",
    specialties: ["General Medicine", "General Surgery", "Cardiology", "Neurology", "Orthopedics", "Pediatrics", "Obstetrics", "Emergency Medicine"],
    emergency: true,
    address: "Asarwa, Ahmedabad",
    note: "One of Asia's largest civil hospitals, attached to B.J. Medical College.",
  },
  {
    id: "un-mehta",
    name: "U N Mehta Institute of Cardiology & Research Centre",
    type: "Govt",
    city: "Ahmedabad",
    area: "Asarwa",
    specialties: ["Cardiology", "Cardiac Surgery"],
    emergency: true,
    address: "Asarwa, Ahmedabad",
  },
  {
    id: "gcri",
    name: "Gujarat Cancer & Research Institute (GCRI)",
    type: "Govt",
    city: "Ahmedabad",
    area: "Asarwa",
    specialties: ["Oncology", "Radiation Therapy", "General Surgery"],
    emergency: false,
    address: "Asarwa, Ahmedabad",
  },
  {
    id: "ikdrc",
    name: "IKDRC-ITS Kidney Hospital",
    type: "Govt",
    city: "Ahmedabad",
    area: "Asarwa",
    specialties: ["Nephrology", "Urology", "Kidney Transplant", "Dialysis"],
    emergency: false,
    address: "Asarwa, Ahmedabad",
  },
  {
    id: "zydus-ahd",
    name: "Zydus Hospitals, Ahmedabad",
    type: "Private",
    city: "Ahmedabad",
    area: "Thaltej",
    specialties: ["Cardiology", "Neurology", "Orthopedics", "Oncology", "Gastroenterology", "Emergency Medicine"],
    emergency: true,
  },
  {
    id: "apollo-ahd",
    name: "Apollo Hospitals, Ahmedabad",
    type: "Private",
    city: "Ahmedabad",
    area: "Bhat",
    specialties: ["Cardiology", "Neurology", "Orthopedics", "Oncology", "Pediatrics", "Emergency Medicine"],
    emergency: true,
  },
  {
    id: "shalby-ahd",
    name: "Shalby Hospital, Ahmedabad",
    type: "Private",
    city: "Ahmedabad",
    area: "Satellite",
    specialties: ["Orthopedics", "Joint Replacement", "Cardiology", "Neurology"],
    emergency: true,
    note: "Well known for joint replacement surgery.",
  },
  {
    id: "sterling-ahd",
    name: "Sterling Hospital, Ahmedabad",
    type: "Private",
    city: "Ahmedabad",
    area: "Memnagar",
    specialties: ["Cardiology", "Orthopedics", "Neurology", "Gastroenterology", "Emergency Medicine"],
    emergency: true,
  },
  {
    id: "kd-ahd",
    name: "KD Hospital, Ahmedabad",
    type: "Private",
    city: "Ahmedabad",
    area: "Vaishnodevi",
    specialties: ["Cardiology", "Orthopedics", "Neurology", "Pediatrics", "Emergency Medicine"],
    emergency: true,
  },
  {
    id: "cims-ahd",
    name: "CIMS Hospital, Ahmedabad",
    type: "Private",
    city: "Ahmedabad",
    area: "Science City Road",
    specialties: ["Cardiology", "Cardiac Surgery", "Emergency Medicine"],
    emergency: true,
    note: "Cardiac care focused.",
  },
  // ---------- Rajkot ----------
  {
    id: "civil-rajkot",
    name: "Rajkot Civil Hospital",
    type: "Govt",
    city: "Rajkot",
    area: "Hospital Chowk, Jamnagar Road",
    specialties: ["General Medicine", "General Surgery", "Orthopedics", "Gynecology", "Pediatrics", "Cardiology", "Emergency Medicine"],
    emergency: true,
    address: "Jamnagar Road, Rajkot",
  },
  {
    id: "pdu-rajkot",
    name: "Pandit Deendayal Upadhyay Govt Medical College & Hospital",
    type: "Govt",
    city: "Rajkot",
    area: "Jamnagar Road",
    specialties: ["General Medicine", "General Surgery", "Obstetrics", "Pediatrics", "Emergency Medicine"],
    emergency: true,
  },
  {
    id: "aiims-rajkot",
    name: "AIIMS Rajkot",
    type: "Govt",
    city: "Rajkot",
    area: "Khanderi",
    specialties: ["General Medicine", "General Surgery", "Cardiology", "Pediatrics", "Obstetrics", "Emergency Medicine"],
    emergency: true,
    note: "New AIIMS campus on the outskirts of Rajkot; departments expanding.",
  },
  {
    id: "gt-sheth",
    name: "G.T. Sheth Govt Eye Hospital",
    type: "Govt",
    city: "Rajkot",
    area: "Jamnagar Road",
    specialties: ["Ophthalmology", "Cataract Surgery"],
    emergency: false,
  },
  {
    id: "kt-children",
    name: "K.T. Children Govt Hospital",
    type: "Govt",
    city: "Rajkot",
    area: "Civil Hospital Campus",
    specialties: ["Pediatrics"],
    emergency: true,
  },
  {
    id: "janana-rajkot",
    name: "Janana Govt Maternity Hospital",
    type: "Govt",
    city: "Rajkot",
    area: "Hospital Chowk",
    specialties: ["Obstetrics", "Gynecology"],
    emergency: true,
  },
  {
    id: "wockhardt-rajkot",
    name: "Wockhardt Hospitals, Rajkot",
    type: "Private",
    city: "Rajkot",
    area: "Gondal Road",
    specialties: ["Cardiology", "Neurology", "Orthopedics", "Urology", "Oncology", "Emergency Medicine"],
    emergency: true,
  },
  {
    id: "sterling-rajkot",
    name: "Sterling Hospitals, Rajkot",
    type: "Private",
    city: "Rajkot",
    area: "150 Feet Ring Road",
    specialties: ["Cardiology", "Orthopedics", "Neurology", "Gastroenterology", "Emergency Medicine"],
    emergency: true,
  },
  {
    id: "synergy-rajkot",
    name: "Synergy Hospital, Rajkot",
    type: "Private",
    city: "Rajkot",
    area: "150 Feet Ring Road",
    specialties: ["Cardiology", "Gastroenterology", "Urology", "Oncology"],
    emergency: true,
  },
  {
    id: "hcg-rajkot",
    name: "HCG Hospitals, Rajkot",
    type: "Private",
    city: "Rajkot",
    area: "Rajkot",
    specialties: ["Oncology", "General Surgery", "Orthopedics", "Internal Medicine"],
    emergency: true,
    note: "Cancer-care focused network hospital.",
  },
  {
    id: "gokul-rajkot",
    name: "Gokul Superspeciality Hospital, Rajkot",
    type: "Private",
    city: "Rajkot",
    area: "Astron Chowk",
    specialties: ["Neurosurgery", "Orthopedics", "Cardiology", "Pediatrics"],
    emergency: true,
  },
  {
    id: "giriraj-rajkot",
    name: "Shree Giriraj Multispeciality Hospital, Rajkot",
    type: "Private",
    city: "Rajkot",
    area: "150 Feet Ring Road",
    specialties: ["Cardiology", "Neurology", "Orthopedics", "Nephrology", "Oncology"],
    emergency: true,
  },
  // ---------- Rest of Gujarat ----------
  {
    id: "ssg-vadodara",
    name: "SSG Hospital (Govt Medical College), Vadodara",
    type: "Govt",
    city: "Vadodara",
    area: "Jail Road",
    specialties: ["General Medicine", "General Surgery", "Orthopedics", "Pediatrics", "Obstetrics", "Emergency Medicine"],
    emergency: true,
  },
  {
    id: "civil-surat",
    name: "Civil Hospital, Surat",
    type: "Govt",
    city: "Surat",
    area: "Majura Gate",
    specialties: ["General Medicine", "General Surgery", "Orthopedics", "Pediatrics", "Emergency Medicine"],
    emergency: true,
  },
  {
    id: "sirt-bhavnagar",
    name: "Sir Takhtasinhji General Hospital, Bhavnagar",
    type: "Govt",
    city: "Bhavnagar",
    area: "Waghawadi Road",
    specialties: ["General Medicine", "General Surgery", "Orthopedics", "Pediatrics", "Emergency Medicine"],
    emergency: true,
  },
  // ---------- Govt primary care (representative; details unverified) ----------
  {
    id: "uphc-rajkot",
    name: "Urban Primary Health Centre (Govt)",
    type: "Govt",
    city: "Rajkot",
    area: "Rajkot city",
    specialties: ["Primary Care", "Immunisation", "General Medicine"],
    emergency: false,
    note: "Representative entry — contact via Rajkot Municipal Corporation health dept.",
  },
  {
    id: "chc-kuvadva",
    name: "Community Health Centre, Kuvadva",
    type: "Govt",
    city: "Rajkot",
    area: "Kuvadva",
    specialties: ["Primary Care", "Obstetrics", "General Medicine"],
    emergency: false,
    note: "Representative entry — contact via district health office.",
  },
  {
    id: "chc-gondal",
    name: "Community Health Centre, Gondal",
    type: "Govt",
    city: "Gondal",
    area: "Gondal",
    specialties: ["Primary Care", "General Medicine"],
    emergency: false,
    note: "Representative entry — contact via district health office.",
  },
  // ---------- All-India reputed ----------
  {
    id: "aiims-delhi",
    name: "AIIMS, New Delhi",
    type: "Govt",
    city: "New Delhi",
    area: "Ansari Nagar",
    specialties: ["Cardiology", "Neurology", "Oncology", "Orthopedics", "Pediatrics", "Emergency Medicine"],
    emergency: true,
    note: "India's apex public teaching hospital.",
  },
  {
    id: "pgimer",
    name: "PGIMER, Chandigarh",
    type: "Govt",
    city: "Chandigarh",
    area: "Sector 12",
    specialties: ["Cardiology", "Neurology", "Nephrology", "Pediatrics", "Emergency Medicine"],
    emergency: true,
  },
  {
    id: "jipmer",
    name: "JIPMER, Puducherry",
    type: "Govt",
    city: "Puducherry",
    area: "Dhanvantri Nagar",
    specialties: ["General Medicine", "General Surgery", "Cardiology", "Pediatrics", "Emergency Medicine"],
    emergency: true,
  },
  {
    id: "nimhans",
    name: "NIMHANS, Bengaluru",
    type: "Govt",
    city: "Bengaluru",
    area: "Hosur Road",
    specialties: ["Neurology", "Neurosurgery", "Psychiatry"],
    emergency: true,
  },
  {
    id: "tata-memorial",
    name: "Tata Memorial Hospital, Mumbai",
    type: "Govt",
    city: "Mumbai",
    area: "Parel",
    specialties: ["Oncology", "Radiation Therapy"],
    emergency: false,
    note: "Apex public cancer centre.",
  },
  {
    id: "cmc-vellore",
    name: "Christian Medical College (CMC), Vellore",
    type: "Private",
    city: "Vellore",
    area: "Vellore",
    specialties: ["General Medicine", "Cardiology", "Neurology", "Oncology", "Pediatrics", "Emergency Medicine"],
    emergency: true,
    note: "Not-for-profit teaching hospital.",
  },
  {
    id: "medanta",
    name: "Medanta – The Medicity, Gurugram",
    type: "Private",
    city: "Gurugram",
    area: "Sector 38",
    specialties: ["Cardiology", "Cardiac Surgery", "Neurology", "Oncology", "Orthopedics", "Emergency Medicine"],
    emergency: true,
  },
  {
    id: "max-saket",
    name: "Max Super Speciality Hospital, Saket",
    type: "Private",
    city: "New Delhi",
    area: "Saket",
    specialties: ["Cardiology", "Oncology", "Neurology", "Orthopedics", "Emergency Medicine"],
    emergency: true,
  },
  {
    id: "fortis-escorts",
    name: "Fortis Escorts Heart Institute, Delhi",
    type: "Private",
    city: "New Delhi",
    area: "Okhla",
    specialties: ["Cardiology", "Cardiac Surgery", "Emergency Medicine"],
    emergency: true,
  },
  {
    id: "kokilaben",
    name: "Kokilaben Dhirubhai Ambani Hospital, Mumbai",
    type: "Private",
    city: "Mumbai",
    area: "Andheri West",
    specialties: ["Cardiology", "Neurology", "Oncology", "Orthopedics", "Emergency Medicine"],
    emergency: true,
  },
  {
    id: "narayana-blr",
    name: "Narayana Health City, Bengaluru",
    type: "Private",
    city: "Bengaluru",
    area: "Bommasandra",
    specialties: ["Cardiology", "Cardiac Surgery", "Oncology", "Pediatrics"],
    emergency: true,
  },
  {
    id: "aravind",
    name: "Aravind Eye Hospital, Madurai",
    type: "Private",
    city: "Madurai",
    area: "Anna Nagar",
    specialties: ["Ophthalmology", "Cataract Surgery"],
    emergency: false,
    note: "High-volume not-for-profit eye-care network.",
  },
  {
    id: "sankara",
    name: "Sankara Nethralaya, Chennai",
    type: "Private",
    city: "Chennai",
    area: "Nungambakkam",
    specialties: ["Ophthalmology", "Cataract Surgery"],
    emergency: false,
    note: "Not-for-profit eye hospital.",
  },
  // ---------- High-quality clinics only (no street clinics) ----------
  {
    id: "morjaria-dental",
    name: "Dr. Morjaria Advanced Dental Clinic",
    type: "Clinic",
    city: "Rajkot",
    area: "Rajkot",
    specialties: ["Dental"],
    emergency: false,
  },
  {
    id: "bavishi-eye",
    name: "Bavishi Eye Clinic",
    type: "Clinic",
    city: "Rajkot",
    area: "Vidhyanagar Main Road",
    specialties: ["Ophthalmology", "Cataract Surgery"],
    emergency: false,
  },
  {
    id: "senses-ent",
    name: "Senses ENT Clinic",
    type: "Clinic",
    city: "Rajkot",
    area: "Rajkot",
    specialties: ["ENT"],
    emergency: false,
  },
  {
    id: "savani-kidney",
    name: "B.T. Savani Kidney Clinic",
    type: "Clinic",
    city: "Rajkot",
    area: "Rajkot",
    specialties: ["Nephrology", "Dialysis"],
    emergency: false,
  },
  {
    id: "cfs-ahd",
    name: "Centre for Sight, Ahmedabad",
    type: "Clinic",
    city: "Ahmedabad",
    area: "Ahmedabad",
    specialties: ["Ophthalmology", "Cataract Surgery"],
    emergency: false,
    note: "Eye-care chain clinic.",
  },
  {
    id: "apollo-clinic-ahd",
    name: "Apollo Clinic, Ahmedabad",
    type: "Clinic",
    city: "Ahmedabad",
    area: "Ahmedabad",
    specialties: ["General Medicine", "Primary Care"],
    emergency: false,
    note: "Branded primary-care/diagnostics chain clinic.",
  },
];

/**
 * Doctors linked to the facilities above.
 * Names come from this repo's own user-provided seed (seed_real.sql) and are
 * NOT independently verified — only name + specialty + hospital are listed.
 * No fees, ratings, languages or availability are claimed.
 */
export const DOCTORS: DoctorEntry[] = [
  { id: "doc-solanki", name: "Dr. Dharmesh R. Solanki", specialty: "Cardiology", hospitalId: "wockhardt-rajkot", hospitalName: "Wockhardt Hospitals, Rajkot" },
  { id: "doc-bparekh", name: "Dr. Bharat Parekh", specialty: "Internal Medicine", hospitalId: "hcg-rajkot", hospitalName: "HCG Hospitals, Rajkot" },
  { id: "doc-ladani", name: "Dr. N.G. Ladani", specialty: "General Surgery", hospitalId: "hcg-rajkot", hospitalName: "HCG Hospitals, Rajkot" },
  { id: "doc-sagar", name: "Dr. Rajendra Sagar", specialty: "General Surgery", hospitalId: "hcg-rajkot", hospitalName: "HCG Hospitals, Rajkot" },
  { id: "doc-saradava", name: "Dr. Achal Saradava", specialty: "Orthopedics", hospitalId: "hcg-rajkot", hospitalName: "HCG Hospitals, Rajkot" },
  { id: "doc-mdave", name: "Dr. Mittal Dave", specialty: "Orthopedics", hospitalId: "hcg-rajkot", hospitalName: "HCG Hospitals, Rajkot" },
  { id: "doc-vaghasia", name: "Dr. Dishit Vaghasia", specialty: "Orthopedics", hospitalId: "hcg-rajkot", hospitalName: "HCG Hospitals, Rajkot" },
  { id: "doc-gadkari", name: "Dr. Ameya S. Gadkari", specialty: "Cardiac Surgery", hospitalId: "hcg-rajkot", hospitalName: "HCG Hospitals, Rajkot" },
  { id: "doc-gpatel", name: "Dr. Girish Patel", specialty: "Internal Medicine", hospitalId: "hcg-rajkot", hospitalName: "HCG Hospitals, Rajkot" },
  { id: "doc-sbhatt", name: "Dr. Sanjay Bhatt", specialty: "Internal Medicine", hospitalId: "hcg-rajkot", hospitalName: "HCG Hospitals, Rajkot" },
  { id: "doc-rakholia", name: "Dr. Vinod Rakholia", specialty: "Internal Medicine", hospitalId: "hcg-rajkot", hospitalName: "HCG Hospitals, Rajkot" },
  { id: "doc-ymehta", name: "Dr. Yogesh Mehta", specialty: "General Surgery", hospitalId: "hcg-rajkot", hospitalName: "HCG Hospitals, Rajkot" },
  { id: "doc-motani", name: "Dr. Hemal Motani", specialty: "General Surgery", hospitalId: "hcg-rajkot", hospitalName: "HCG Hospitals, Rajkot" },
  {
    id: "doc-kteraiya",
    name: "Dr. Khushal Teraiya",
    specialty: "General Medicine",
    hospitalId: null,
    hospitalName: "Rajkot (private practice)",
    note: "Practice location unverified — contact via hospital directory.",
  },
];

export function getFacilityById(id: string): Facility | undefined {
  return HOSPITALS.find((h) => h.id === id);
}

export function getDoctorsByHospital(hospitalId: string): DoctorEntry[] {
  return DOCTORS.filter((d) => d.hospitalId === hospitalId);
}

/** Compact dataset summary for stuffing into the AI-search system prompt. */
export function datasetSummary(): string {
  return HOSPITALS.map(
    (h) => `${h.id} | ${h.name} | ${h.type} | ${h.city} (${h.area}) | ${h.specialties.join(", ")} | emergency:${h.emergency ? "yes" : "no"}`
  ).join("\n");
}
