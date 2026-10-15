"use client";

import React, { useEffect, useState } from "react";
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
  // useMemo + try/catch keeps prerender (no env vars) from crashing the build.
  const supabase = React.useMemo(() => {
    try {
      return useSupabase();
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    let active = true;
    let listener: { subscription: { unsubscribe: () => void } } | null = null;

    try {
    // Fires immediately with the persisted session and on every later
    // sign-in / sign-out / token-refresh event.
    const sub = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setUser(session?.user ?? null);
      setLoading(false);
    });
    listener = sub.data;

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
      try {
        listener?.subscription.unsubscribe();
      } catch {
        /* ignore */
      }
    };
    } catch {
      if (active) setLoading(false);
      return () => {
        active = false;
      };
    }
  }, [supabase]);

  return { user, loading };
}
