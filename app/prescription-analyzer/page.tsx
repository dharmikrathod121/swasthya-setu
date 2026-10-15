import { AppLayout } from "@/components/app-layout";
import PrescriptionAnalyzerClient from "./prescription-analyzer-client";

export const metadata = {
  title: "AI Prescription Analyzer | Swasthya Setu",
  description: "Scan a prescription to understand dosages, timing and interactions.",
};

export default function Page() {
  return (
    <AppLayout>
      <PrescriptionAnalyzerClient />
    </AppLayout>
  );
}
