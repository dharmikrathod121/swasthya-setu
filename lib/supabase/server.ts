import { createClient as createSupabaseClient } from "@supabase/supabase-js";

function supabaseUrl() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
  return url;
}

/**
 * User-scoped server client (respects RLS). Used by callback + user flows.
 */
export function createClient() {
  return createSupabaseClient(
    supabaseUrl(),
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Privileged server client for API routes (bypasses RLS).
 * Uses SERVICE_ROLE_KEY when available, falls back to ANON_KEY for local dev.
 */
export function createServiceClient() {
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createSupabaseClient(supabaseUrl(), serviceKey, {
    auth: { persistSession: false },
  });
}
