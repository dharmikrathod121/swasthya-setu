import { Metadata } from "next";
import { getHospitalById } from "@/lib/data/mock-data";
import { getFacilityById } from "@/lib/hospitals-data";
import HospitalDetailClient from "./hospital-detail-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const facility = getFacilityById(id);
  if (facility) {
    return {
      title: `${facility.name} — Swasthya Setu`,
      description: `Verified listing for ${facility.name} (${facility.area}, ${facility.city}). Specialities: ${facility.specialties.slice(0, 5).join(", ")}.`,
    };
  }
  const hospital = getHospitalById(id);
  if (!hospital) return { title: "Hospital not found — Swasthya Setu" };
  return {
    title: `${hospital.name} — Swasthya Setu`,
    description: `View specialities, doctors, patient reviews and live queue status for ${hospital.name}.`,
  };
}

export default async function HospitalDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <HospitalDetailClient id={id} />;
}
