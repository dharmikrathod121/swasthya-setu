import { AppLayout } from "@/components/app-layout";
import ReportAnalyzerClient from "./report-analyzer-client";

export const metadata = {
  title: "AI Medical Report Analyzer | Swasthya Setu",
  description: "Upload a lab report and get plain-language explanations of your results.",
};

export default function Page() {
  return (
    <AppLayout>
      <ReportAnalyzerClient />
    </AppLayout>
  );
}
