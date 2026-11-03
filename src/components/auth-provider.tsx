"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { apiFetch } from "@/lib/api";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "@/lib/auth-storage";

export type AuthUser = {
  id: string;
  email: string;
  role: string;
  schoolId: string | null;
  status: string;
  redirectTo?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<string>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  token: string | null;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const loadMe = useCallback(async (access: string) => {
    const me = await apiFetch<AuthUser>("/api/auth/me", { token: access });
    setUser(me);
    setToken(access);
  }, []);

  const refresh = useCallback(async () => {
    const refreshTok = getRefreshToken();
    if (!refreshTok) {
      setUser(null);
      setToken(null);
      return;
    }
    const res = await apiFetch<{ accessToken: string }>("/api/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken: refreshTok }),
    });
    setTokens(res.accessToken, refreshTok);
    await loadMe(res.accessToken);
  }, [loadMe]);

  useEffect(() => {
    const access = getAccessToken();
    if (!access) {
      setLoading(false);
      return;
    }
    loadMe(access)
      .catch(() =>
        refresh().catch(() => {
          clearTokens();
          setUser(null);
          setToken(null);
        })
      )
      .finally(() => setLoading(false));
  }, [loadMe, refresh]);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await apiFetch<{
        accessToken: string;
        refreshToken: string;
        redirectTo: string;
        user: AuthUser;
      }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setTokens(res.accessToken, res.refreshToken);
      setUser(res.user);
      setToken(res.accessToken);
      return res.redirectTo;
    },
    []
  );

  const logout = useCallback(async () => {
    const access = getAccessToken();
    try {
      if (access) {
        await apiFetch("/api/auth/logout", { method: "POST", token: access });
      }
    } finally {
      clearTokens();
      setUser(null);
      setToken(null);
    }
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, logout, refresh, token }),
    [user, loading, login, logout, refresh, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
