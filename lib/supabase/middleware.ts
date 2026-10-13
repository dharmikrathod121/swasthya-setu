import { createServerClient } from "@supabase/auth-helpers-nextjs";
import type { NextRequest, NextResponse } from "next/server";

import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase client for use in Next.js middleware.
 *
 * Reads the session from request cookies and writes refreshed session
 * tokens back onto the response cookies. The caller must pass the same
 * `NextResponse` it returns so cookie updates are persisted.
 */
export function createMiddlewareClient({
  request,
  response,
}: {
  request: NextRequest;
  response: NextResponse;
}): SupabaseClient {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );
}