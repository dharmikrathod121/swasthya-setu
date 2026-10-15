import { AppLayout } from "@/components/app-layout";

export default function MedicineCatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
