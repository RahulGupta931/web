"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SchoolLoadingScreen } from "@/components/school-loading-screen";
import { useAuth } from "./auth-provider";

export function RequireAuth({
  roles,
  children,
}: {
  roles: string[];
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (!roles.includes(user.role)) {
      router.replace(user.redirectTo ?? "/login");
    }
  }, [user, loading, roles, router]);

  if (loading || !user || !roles.includes(user.role)) {
    return <SchoolLoadingScreen message="Checking your session…" />;
  }

  return <>{children}</>;
}
