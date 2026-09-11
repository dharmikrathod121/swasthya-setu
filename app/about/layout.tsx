import { AppLayout } from "@/components/app-layout";

export default function AppShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
