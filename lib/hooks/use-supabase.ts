"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export function useSupabase() {
  return createClient();
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // createBrowserClient is a singleton in the browser, so this reference is
  // stable across renders and the subscription below is never re-created.
  const supabase = useSupabase();

  useEffect(() => {
    let active = true;

    // Fires immediately with the persisted session and on every later
    // sign-in / sign-out / token-refresh event.
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Confirm against the auth server so stale/invalid sessions resolve.
    // If this fails (offline, expired refresh token) we fall back to the
    // session the listener already reported instead of hanging on `loading`.
    supabase.auth
      .getUser()
      .then(({ data }) => {
        if (!active) return;
        setUser(data.user ?? null);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setUser(null);
        setLoading(false);
      });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  return { user, loading };
}
