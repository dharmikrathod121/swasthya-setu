export interface Review {
  name: string;
  date: string;
  rating: number;
  text: string;
}

export interface DoctorDetail {
  name: string;
  dept: string;
  exp: string;
  lang: string;
  avail: string;
}

export interface QueueDatum {
  dept: string;
  wait: number;
}

export interface Hospital {
  id: string;
  name: string;
  type: "Govt" | "Private";
  location: string;
  rating: number;
  reviewsCount: number;
  specialties: string[];
  distance: string;
  distanceKm: number;
  queue: "low" | "medium" | "busy";
  available: boolean;
  openNow: boolean;
  logoColor: string;
  address: string;
  phone: string;
  hours: string;
  opdTiming: string;
  doctors: DoctorDetail[];
  reviews: Review[];
  queueData: QueueDatum[];
  lastUpdated: number;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  rating: number;
  experience: string;
  languages: string[];
  fee: number;
  nextAvailable: string;
  bio: string;
  education: string[];
  specializations: string[];
  clinicTimings: { day: string; slots: string[] }[];
  reviews: {
    author: string;
    date: string;
    rating: number;
    text: string;
    initials: string;
  }[];
}

export interface Medicine {
  id: string;
  name: string;
  generic: string;
  category: string;
  uses: string;
  dosage: string;
  sideEffects: string;
  priceRange: string;
}

export const hospitals: Hospital[] = [
  {
    id: "1",
    name: "Rajkot Civil Hospital",
    type: "Govt",
    location: "Rajkot, Gujarat",
    rating: 4.2,
    reviewsCount: 1280,
    specialties: ["Cardiology", "Neurology", "Orthopedics"],
    distance: "2.3 km",
    distanceKm: 2.3,
    queue: "medium",
    available: true,
    openNow: true,
    logoColor: "#0D7377",
    address: "Civil Hospital Campus, Jamnagar Road, Rajkot 360001",
    phone: "+91 281 245 6789",
    hours: "Open 24/7",
    opdTiming: "Mon–Sat · 9:00 AM – 1:00 PM",
    doctors: [
      { name: "Dr. R. K. Sharma", dept: "Cardiology", exp: "15 yrs", lang: "Hindi, English, Marathi", avail: "Today" },
      { name: "Dr. Amit Patel", dept: "Orthopedics", exp: "12 yrs", lang: "Gujarati, Hindi, English", avail: "Tomorrow" },
    ],
    reviews: [
      { name: "Rahul P.", date: "2 weeks ago", rating: 5, text: "Free OPD and very helpful staff. Wait time was reasonable in the morning." },
      { name: "Sneha M.", date: "1 month ago", rating: 4, text: "Good government facility. Crowded but doctors are experienced." },
    ],
    queueData: [
      { dept: "General Medicine", wait: 35 },
      { dept: "Cardiology", wait: 50 },
      { dept: "Orthopedics", wait: 20 },
      { dept: "Pediatrics", wait: 15 },
      { dept: "Emergency", wait: 5 },
    ],
    lastUpdated: Date.now() - 1000 * 60 * 8,
  },
  {
    id: "2",
    name: "Apollo Hospitals",
    type: "Private",
    location: "Rajkot, Gujarat",
    rating: 4.7,
    reviewsCount: 940,
    specialties: ["Cardiology", "Oncology", "Pediatrics"],
    distance: "5.1 km",
    distanceKm: 5.1,
    queue: "low",
    available: true,
    openNow: true,
    logoColor: "#C2410C",
    address: "Kalawad Road, Near Raiya Telephone Exc., Rajkot 360005",
    phone: "+91 281 712 3456",
    hours: "Open 24/7",
    opdTiming: "Mon–Sun · 8:00 AM – 8:00 PM",
    doctors: [
      { name: "Dr. Priya Mehta", dept: "Cardiology", exp: "15 yrs", lang: "Hindi, English, Gujarati", avail: "Today" },
      { name: "Dr. Neha Joshi", dept: "Pediatrics", exp: "8 yrs", lang: "English, Hindi", avail: "Tomorrow" },
    ],
    reviews: [
      { name: "Amit K.", date: "3 days ago", rating: 5, text: "Clean, well-managed private hospital. Booked OPD online and was seen on time." },
      { name: "Divya R.", date: "2 weeks ago", rating: 4, text: "Excellent care in cardiology. A bit expensive but worth it." },
    ],
    queueData: [
      { dept: "General Medicine", wait: 12 },
      { dept: "Cardiology", wait: 18 },
      { dept: "Neurology", wait: 25 },
      { dept: "Oncology", wait: 10 },
      { dept: "Emergency", wait: 4 },
    ],
    lastUpdated: Date.now() - 1000 * 60 * 3,
  },
  {
    id: "3",
    name: "Sterling Hospital",
    type: "Private",
    location: "Rajkot, Gujarat",
    rating: 4.5,
    reviewsCount: 610,
    specialties: ["General Surgery", "ENT", "Dermatology"],
    distance: "3.8 km",
    distanceKm: 3.8,
    queue: "busy",
    available: false,
    openNow: true,
    logoColor: "#7C3AED",
    address: "Sadhu Vaswani Road, Rajkot 360005",
    phone: "+91 281 666 7000",
    hours: "Open 24/7",
    opdTiming: "Mon–Sat · 9:00 AM – 6:00 PM",
    doctors: [
      { name: "Dr. Harsh Patel", dept: "General Surgery", exp: "14 yrs", lang: "Gujarati, Hindi, English", avail: "Tomorrow" },
      { name: "Dr. Nisha Vora", dept: "Dermatology", exp: "8 yrs", lang: "Hindi, English", avail: "Today" },
    ],
    reviews: [
      { name: "Kiran J.", date: "5 days ago", rating: 4, text: "Good specialty care. Evening queue gets long, go early." },
    ],
    queueData: [
      { dept: "General Medicine", wait: 45 },
      { dept: "ENT", wait: 30 },
      { dept: "Dermatology", wait: 40 },
      { dept: "Surgery", wait: 55 },
      { dept: "Emergency", wait: 8 },
    ],
    lastUpdated: Date.now() - 1000 * 60 * 15,
  },
  {
    id: "4",
    name: "GMERS Medical College",
    type: "Govt",
    location: "Rajkot, Gujarat",
    rating: 3.9,
    reviewsCount: 540,
    specialties: ["General Medicine", "Obstetrics", "Psychiatry"],
    distance: "4.5 km",
    distanceKm: 4.5,
    queue: "low",
    available: true,
    openNow: true,
    logoColor: "#059669",
    address: "Parsana Nagar, Rajkot 360001",
    phone: "+91 281 222 3456",
    hours: "Open 24/7",
    opdTiming: "Mon–Sat · 8:30 AM – 12:30 PM",
    doctors: [
      { name: "Dr. Jignesh R.", dept: "General Medicine", exp: "13 yrs", lang: "Gujarati, Hindi", avail: "Tomorrow" },
      { name: "Dr. Falguni B.", dept: "Obstetrics", exp: "19 yrs", lang: "Gujarati, English", avail: "Today" },
    ],
    reviews: [
      { name: "Tejal V.", date: "2 weeks ago", rating: 4, text: "Affordable government care. Reach before 9 AM for OPD tokens." },
    ],
    queueData: [
      { dept: "General Medicine", wait: 40 },
      { dept: "Obstetrics", wait: 28 },
      { dept: "Psychiatry", wait: 22 },
      { dept: "Emergency", wait: 7 },
    ],
    lastUpdated: Date.now() - 1000 * 60 * 22,
  },
];

export const doctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. R. K. Sharma",
    specialty: "Cardiologist",
    hospital: "Apollo Hospitals",
    rating: 4.9,
    experience: "15+ years",
    languages: ["Hindi", "English", "Marathi"],
    fee: 800,
    nextAvailable: "Today, 2:00 PM",
    bio: "Dr. R. K. Sharma is a senior consultant cardiologist with over 15 years of experience in interventional cardiology and non-invasive cardiac diagnostics. He has performed over 3,000 successful procedures and is known for patient-centred care.",
    education: [
      "MD (General Medicine) — AIIMS, New Delhi",
      "DM (Cardiology) — PGIMER, Chandigarh",
      "MBBS — B. J. Medical College, Ahmedabad",
    ],
    specializations: [
      "Coronary Angiography & Angioplasty",
      "Echocardiography",
      "Cardiac Rhythm Management",
      "Heart Failure Management",
    ],
    clinicTimings: [
      { day: "Monday – Friday", slots: ["9:00 AM – 1:00 PM", "4:00 PM – 7:00 PM"] },
      { day: "Saturday", slots: ["9:00 AM – 1:00 PM"] },
    ],
    reviews: [
      {
        author: "Rajesh K.",
        date: "2 weeks ago",
        rating: 5,
        text: "Excellent doctor. Very thorough with the diagnosis and explained everything clearly. The procedure was smooth and recovery was quick.",
        initials: "RK",
      },
      {
        author: "Priya S.",
        date: "1 month ago",
        rating: 5,
        text: "Highly recommended! Dr. Sharma's calm demeanour puts patients at ease. Very professional and well-informed.",
        initials: "PS",
      },
      {
        author: "Amit G.",
        date: "2 months ago",
        rating: 4,
        text: "Good experience overall. Wait times were a bit long, but the consultation itself was thorough and worth it.",
        initials: "AG",
      },
    ],
  },
  {
    id: "2",
    name: "Dr. Priya Mehta",
    specialty: "Dermatologist",
    hospital: "Sterling Hospital",
    rating: 4.8,
    experience: "10+ years",
    languages: ["Hindi", "English", "Gujarati"],
    fee: 600,
    nextAvailable: "Tomorrow, 10:00 AM",
    bio: "Dr. Priya Mehta is a board-certified dermatologist specialising in medical and cosmetic dermatology. With over 10 years of clinical experience, she has helped thousands of patients achieve healthier skin through evidence-based treatments.",
    education: [
      "MD (Dermatology) — KEM Hospital, Mumbai",
      "MBBS — SMS Medical College, Jaipur",
    ],
    specializations: [
      "Acne & Scar Treatment",
      "Laser Therapy",
      "Cosmetic Dermatology",
      "Paediatric Dermatology",
    ],
    clinicTimings: [
      { day: "Monday – Thursday", slots: ["10:00 AM – 2:00 PM", "5:00 PM – 8:00 PM"] },
      { day: "Saturday", slots: ["10:00 AM – 2:00 PM"] },
    ],
    reviews: [
      {
        author: "Kavita R.",
        date: "3 days ago",
        rating: 5,
        text: "Dr. Mehta is amazing! My skin has improved so much after following her treatment plan. Very patient and understanding.",
        initials: "KR",
      },
      {
        author: "Neha V.",
        date: "2 weeks ago",
        rating: 5,
        text: "The best dermatologist in Rajkot. She takes time to explain the cause and treatment options thoroughly.",
        initials: "NV",
      },
    ],
  },
  {
    id: "3",
    name: "Dr. Amit Patel",
    specialty: "Orthopedic",
    hospital: "Rajkot Civil Hospital",
    rating: 4.6,
    experience: "12+ years",
    languages: ["Gujarati", "Hindi", "English"],
    fee: 500,
    nextAvailable: "Today, 4:00 PM",
    bio: "Dr. Amit Patel is a consultant orthopaedic surgeon with 12+ years of experience in joint replacement, sports injuries, and trauma surgery. He is committed to providing accessible quality care to the community.",
    education: [
      "MS (Orthopaedics) — Baroda Medical College",
      "MBBS — M. P. Shah Medical College, Jamnagar",
    ],
    specializations: [
      "Knee & Hip Replacement",
      "Sports Injury Rehabilitation",
      "Arthroscopy",
      "Spine Surgery",
    ],
    clinicTimings: [
      { day: "Monday – Saturday", slots: ["8:00 AM – 12:00 PM", "4:00 PM – 6:30 PM"] },
    ],
    reviews: [
      {
        author: "Prakash D.",
        date: "1 week ago",
        rating: 5,
        text: "Very skilled surgeon. After my knee replacement surgery I can walk again without pain. Thank you, Dr. Patel!",
        initials: "PD",
      },
      {
        author: "Sneha T.",
        date: "3 weeks ago",
        rating: 4,
        text: "Good doctor with a lot of experience. The only minor issue was the waiting time at the hospital.",
        initials: "ST",
      },
      {
        author: "Rahul M.",
        date: "1 month ago",
        rating: 5,
        text: "Dr. Patel diagnosed my shoulder issue correctly on the first visit. Treatment plan is working well.",
        initials: "RM",
      },
    ],
  },
  {
    id: "4",
    name: "Dr. Neha Joshi",
    specialty: "Pediatrician",
    hospital: "Apollo Hospitals",
    rating: 4.9,
    experience: "8+ years",
    languages: ["English", "Hindi"],
    fee: 700,
    nextAvailable: "Tomorrow, 11:00 AM",
    bio: "Dr. Neha Joshi is a dedicated paediatrician with 8+ years of experience caring for children from newborns to adolescents. Her warm and gentle approach makes every visit comfortable for both children and parents.",
    education: [
      "MD (Paediatrics) — JIPMER, Puducherry",
      "MBBS — Grant Medical College, Mumbai",
    ],
    specializations: [
      "Neonatal & Infant Care",
      "Vaccination & Immunisation",
      "Paediatric Nutrition",
      "Asthma & Allergy in Children",
    ],
    clinicTimings: [
      { day: "Monday – Friday", slots: ["9:00 AM – 1:00 PM", "3:00 PM – 6:00 PM"] },
      { day: "Saturday", slots: ["9:00 AM – 1:00 PM"] },
    ],
    reviews: [
      {
        author: "Ritu A.",
        date: "5 days ago",
        rating: 5,
        text: "Dr. Joshi is the best paediatrician we have taken our daughter to. She is so patient with kids and very thorough.",
        initials: "RA",
      },
      {
        author: "Manish S.",
        date: "2 weeks ago",
        rating: 5,
        text: "Very knowledgeable. She explained our newborn's jaundice treatment in a very reassuring way.",
        initials: "MS",
      },
    ],
  },
  {
    id: "5",
    name: "Dr. Vikram Singh",
    specialty: "Neurologist",
    hospital: "GMERS Medical College",
    rating: 4.5,
    experience: "18+ years",
    languages: ["Hindi", "English"],
    fee: 900,
    nextAvailable: "Today, 5:00 PM",
    bio: "Dr. Vikram Singh is a renowned neurologist with 18+ years of experience in treating neurological disorders including stroke, epilepsy, Parkinson's disease, and neuropathies. He has published over 40 research papers in international journals.",
    education: [
      "DM (Neurology) — NIMHANS, Bangalore",
      "MD (Medicine) — KGMC, Lucknow",
      "MBBS — AMU, Aligarh",
    ],
    specializations: [
      "Stroke Management",
      "Epilepsy Treatment",
      "Parkinson's Disease",
      "Neurophysiology (EEG, EMG)",
    ],
    clinicTimings: [
      { day: "Monday – Thursday", slots: ["10:00 AM – 2:00 PM", "5:00 PM – 7:00 PM"] },
      { day: "Friday", slots: ["10:00 AM – 2:00 PM"] },
    ],
    reviews: [
      {
        author: "Dilip J.",
        date: "1 week ago",
        rating: 5,
        text: "Dr. Singh's treatment for my migraines has been life-changing. I'm so glad I found him!",
        initials: "DJ",
      },
      {
        author: "Anita P.",
        date: "1 month ago",
        rating: 4,
        text: "Very experienced neurologist. The appointment was a bit delayed but the consultation was excellent.",
        initials: "AP",
      },
      {
        author: "Suresh K.",
        date: "3 months ago",
        rating: 5,
        text: "His diagnosis was spot-on. The stroke treatment plan he designed helped my father recover remarkably well.",
        initials: "SK",
      },
    ],
  },
];

export const medicines: Medicine[] = [
  {
    id: "1",
    name: "Paracetamol",
    generic: "Acetaminophen",
    category: "Pain Relief",
    uses: "Fever, mild to moderate pain, headache",
    dosage: "500-1000mg every 4-6 hours",
    sideEffects: "Rare: liver damage with overdose",
    priceRange: "₹10 - ₹50",
  },
  {
    id: "2",
    name: "Amoxicillin",
    generic: "Amoxicillin",
    category: "Antibiotic",
    uses: "Bacterial infections, pneumonia, bronchitis",
    dosage: "250-500mg every 8 hours",
    sideEffects: "Nausea, diarrhea, rash",
    priceRange: "₹50 - ₹200",
  },
  {
    id: "3",
    name: "Metformin",
    generic: "Metformin HCl",
    category: "Antidiabetic",
    uses: "Type 2 diabetes management",
    dosage: "500mg twice daily with meals",
    sideEffects: "GI upset, metallic taste",
    priceRange: "₹30 - ₹150",
  },
  {
    id: "4",
    name: "Azithromycin",
    generic: "Azithromycin",
    category: "Antibiotic",
    uses: "Respiratory infections, skin infections",
    dosage: "500mg once daily for 3-5 days",
    sideEffects: "Nausea, abdominal pain",
    priceRange: "₹80 - ₹300",
  },
  {
    id: "5",
    name: "Cetirizine",
    generic: "Cetirizine HCl",
    category: "Antihistamine",
    uses: "Allergies, hay fever, urticaria",
    dosage: "10mg once daily",
    sideEffects: "Drowsiness, dry mouth",
    priceRange: "₹15 - ₹60",
  },
  {
    id: "6",
    name: "Salbutamol",
    generic: "Albuterol",
    category: "Bronchodilator",
    uses: "Asthma, COPD, bronchospasm",
    dosage: "100mcg inhaler, 2 puffs as needed",
    sideEffects: "Tremor, tachycardia, headache",
    priceRange: "₹100 - ₹400",
  },
];

export const SPECIALITIES = [
  "Cardiology",
  "Orthopedics",
  "Pediatrics",
  "Neurology",
  "Gynecology",
  "Oncology",
  "ENT",
  "Dermatology",
  "Nephrology",
  "Gastroenterology",
  "Pulmonology",
  "Ophthalmology",
  "Psychiatry",
  "Urology",
  "General Medicine",
  "General Surgery",
];

export function getHospitalById(id: string): Hospital | undefined {
  return hospitals.find((h) => h.id === id);
}
