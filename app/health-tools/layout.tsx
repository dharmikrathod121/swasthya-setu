import { AppLayout } from "@/components/app-layout";

export default function HealthToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
