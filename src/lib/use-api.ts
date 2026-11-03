"use client";

import { useCallback, useContext } from "react";
import { API_URL, apiFetch } from "./api";
import { useAuth } from "@/components/auth-provider";
import { PanelContext } from "@/components/panel-context";

export function useApi() {
  const { token, loading: authLoading } = useAuth();
  const panelCtx = useContext(PanelContext);
  const panelHeaders = panelCtx?.panelHeaders;

  const get = useCallback(
    <T,>(path: string) => apiFetch<T>(path, { token, panelHeaders }),
    [token, panelHeaders]
  );
  const post = useCallback(
    <T,>(path: string, body: unknown) =>
      apiFetch<T>(path, {
        method: "POST",
        token,
        panelHeaders,
        body: JSON.stringify(body),
      }),
    [token, panelHeaders]
  );
  const patch = useCallback(
    <T,>(path: string, body: unknown) =>
      apiFetch<T>(path, {
        method: "PATCH",
        token,
        panelHeaders,
        body: JSON.stringify(body),
      }),
    [token, panelHeaders]
  );
  const postForm = useCallback(
    async <T,>(path: string, form: FormData) => {
      const headers = new Headers();
      if (token) headers.set("Authorization", `Bearer ${token}`);
      if (panelHeaders) {
        for (const [key, value] of Object.entries(panelHeaders)) {
          if (value) headers.set(key, value);
        }
      }
      const res = await fetch(`${API_URL}${path}`, {
        method: "POST",
        headers,
        body: form,
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const errBody = data as { error?: string };
        throw new Error(typeof errBody.error === "string" ? errBody.error : "Upload failed");
      }
      return data as T;
    },
    [token, panelHeaders]
  );
  const isReady = !authLoading && !!token;
  return { get, post, postForm, patch, token, authLoading, isReady };
}
