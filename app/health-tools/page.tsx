import ToolsClient from "./tools-client";

export const metadata = {
  title: "Health Tools | Swasthya Setu",
  description: "BMI calculator, calorie estimator, and private health trackers.",
};

export default function HealthToolsPage() {
  // NOTE: app/health-tools/layout.tsx already wraps this page in <AppLayout />.
  // All interactivity (calculators + trackers) lives in tools-client.tsx.
  return <ToolsClient />;
}
