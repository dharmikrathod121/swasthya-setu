import { PublicHeader } from "@/components/public-header";
import { PublicFooter } from "@/components/public-footer";

export default function PublicLandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </>
  );
}
