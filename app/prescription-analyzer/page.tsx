import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";
import PrescriptionAnalyzerClient from "./prescription-analyzer-client";

export const metadata = {
  title: "AI Prescription Analyzer | Swasthya Setu",
  description: "Scan a prescription to understand dosages, timing and interactions.",
};

export default function Page() {
  return (
    <>
      <PublicHeader />
      <PrescriptionAnalyzerClient />
      <PublicFooter />
    </>
  );
}
