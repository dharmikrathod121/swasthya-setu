import { createBrowserClient } from "@supabase/auth-helpers-nextjs";

// Placeholder values keep `next build` prerendering alive on hosts (e.g.
// Vercel) where env vars aren't set at build time. At runtime without real
// keys auth simply stays logged out; set NEXT_PUBLIC_SUPABASE_URL and
// NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel env vars for real auth.
const PLACEHOLDER_URL = "https://placeholder.supabase.co";
const PLACEHOLDER_KEY = "placeholder-anon-key";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || PLACEHOLDER_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || PLACEHOLDER_KEY
  );
}
