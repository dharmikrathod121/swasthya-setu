import { AppLayout } from "@/components/app-layout";

export default function FoodAnalyzerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
