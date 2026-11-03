"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdmissionsRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/#enquiry");
  }, [router]);
  return (
    <p className="p-8 text-center text-sm text-muted">Opening admission enquiry…</p>
  );
}
