import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";
import ReportAnalyzerClient from "./report-analyzer-client";

export const metadata = {
  title: "AI Medical Report Analyzer | Swasthya Setu",
  description: "Upload a lab report and get plain-language explanations of your results.",
};

export default function Page() {
  return (
    <>
      <PublicHeader />
      <ReportAnalyzerClient />
      <PublicFooter />
    </>
  );
}
