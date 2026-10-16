import { Metadata } from "next";
import HospitalsClient from "./hospitals-client";

export const metadata: Metadata = {
  title: "Hospitals, Doctors & Clinics Directory — Swasthya Setu",
  description:
    "Browse verified government and private hospitals, doctors and clinics across Rajkot. Filter by type, speciality and emergency care.",
};

export default function HospitalsPage() {
  return <HospitalsClient />;
}
