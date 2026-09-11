"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  requireAuth: (callback: () => void) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = useCallback(() => setIsLoggedIn(true), []);
  const logout = useCallback(() => setIsLoggedIn(false), []);

  const requireAuth = useCallback(
    (cb: () => void) => {
      if (isLoggedIn) {
        cb();
      } else {
        setIsLoggedIn(true);
        cb();
      }
    },
    [isLoggedIn]
  );

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, requireAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
