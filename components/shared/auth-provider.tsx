"use client";

import { createContext, useContext, useCallback, ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/hooks/use-supabase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  requireAuth: (callback: () => void) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();
  // Derived directly from the session user — no mirroring effect needed.
  const isLoggedIn = !!user;

  const login = useCallback(async (email: string, password: string) => {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return {};
  }, []);

  const signup = useCallback(async (email: string, password: string) => {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };
    return {};
  }, []);

  const logout = useCallback(async () => {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    await supabase.auth.signOut();
  }, []);

  const requireAuth = useCallback((cb: () => void) => {
    if (isLoggedIn) {
      cb();
    } else {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  return (
    <AuthContext.Provider value={{ user, loading, isLoggedIn, login, signup, logout, requireAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
