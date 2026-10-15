import { AppLayout } from "@/components/app-layout";

export default function AiServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
