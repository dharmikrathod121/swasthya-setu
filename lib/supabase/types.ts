export interface Hospital {
  id: string;
  name: string;
  type: "Govt" | "Private";
  location: string;
  rating: number;
  reviews_count: number;
  specialties: string[];
  distance_km: number;
  queue_status: "low" | "medium" | "busy";
  available: boolean;
  open_now: boolean;
  logo_color: string;
  address: string;
  phone: string;
  hours: string;
  opd_timing: string;
  last_updated: string;
  created_at: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital_id: string | null;
  rating: number;
  experience: string;
  languages: string[];
  fee: number;
  next_available: string;
  bio: string;
  education: string[];
  specializations: string[];
  created_at: string;
}

export interface DoctorClinicTiming {
  id: string;
  doctor_id: string;
  day: string;
  slots: string[];
  created_at: string;
}

export interface Appointment {
  id: string;
  user_id: string;
  doctor_id: string | null;
  hospital_id: string | null;
  patient_name: string;
  phone: string;
  date: string;
  time: string;
  type: string;
  reason: string;
  notes: string;
  status: "upcoming" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  hospital_id: string;
  user_id: string | null;
  name: string;
  rating: number;
  text: string;
  date: string;
  created_at: string;
}

export interface QueueReport {
  id: string;
  hospital_id: string;
  user_id: string | null;
  dept: string;
  wait_time: number;
  created_at: string;
}

export interface Medicine {
  id: string;
  name: string;
  generic: string;
  category: string;
  uses: string;
  dosage: string;
  side_effects: string;
  price_range: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  user_id: string | null;
  message: string;
  is_doctor: boolean;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  created_at: string;
}
