import ClinicsClient from "./clinics-client";

export const metadata = {
  title: "Clinics in Rajkot | Swasthya Setu",
  description: "Diagnostics, dental, physiotherapy, eye care and more clinics across Rajkot.",
};

export default function ClinicsPage() {
  // NOTE: app/clinics/layout.tsx already wraps this page in <AppLayout />.
  // Data comes live from /api/hospitals?type=clinic (DB first, static fallback).
  return <ClinicsClient />;
}
