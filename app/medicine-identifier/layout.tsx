import { AppLayout } from "@/components/app-layout";

export default function MedicineIdentifierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
