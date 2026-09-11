import { Metadata } from "next";
import HospitalsClient from "./hospitals-client";

export const metadata: Metadata = {
  title: "Hospitals Directory — Swasthya Setu",
  description:
    "Browse government and private hospitals in Rajkot. Filter by type, speciality, rating, distance, availability and live queue status.",
};

export default function HospitalsPage() {
  return <HospitalsClient />;
}
