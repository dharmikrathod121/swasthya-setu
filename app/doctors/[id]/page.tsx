import { Metadata } from "next";
import { notFound } from "next/navigation";
import { doctors } from "@/lib/data/mock-data";
import DoctorProfileClient from "./doctor-profile-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const doctor = doctors.find((d) => d.id === id);
  if (!doctor) return { title: "Doctor not found — Swasthya Setu" };
  return {
    title: `${doctor.name} — Swasthya Setu`,
    description: `View ${doctor.name}'s bio, education, specialisations, clinic timings, fees and patient reviews. Chat on WhatsApp to consult.`,
  };
}

export default async function DoctorDetailPage({ params }: PageProps) {
  const { id } = await params;
  const doctor = doctors.find((d) => d.id === id);

  if (!doctor) {
    notFound();
  }

  return (
    <DoctorProfileClient
      doctor={{
        id: doctor.id,
        name: doctor.name,
        specialty: doctor.specialty,
        hospital_id: doctor.hospital,
        rating: doctor.rating,
        experience: doctor.experience,
        languages: doctor.languages,
        fee: doctor.fee,
        bio: doctor.bio,
        education: doctor.education,
        specializations: doctor.specializations,
        reviews: doctor.reviews,
        clinic_timings: doctor.clinicTimings,
      }}
    />
  );
}
