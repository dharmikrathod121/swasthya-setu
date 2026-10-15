import { redirect } from "next/navigation";

interface SigninPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Canonical sign-in lives at /login. /signin exists as an alias so both
 * conventions work — it forwards (preserving ?next= / ?redirect=).
 */
export default async function SigninPage({ searchParams }: SigninPageProps) {
  const params = (await searchParams) ?? {};
  const pick = (v: string | string[] | undefined) =>
    Array.isArray(v) ? v[0] : v;
  const rawNext = pick(params.next) ?? pick(params.redirect);

  redirect(rawNext ? `/login?next=${encodeURIComponent(rawNext)}` : "/login");
}
