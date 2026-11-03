export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

/** Resolve API-hosted paths (e.g. uploaded date sheet images). */
export function resolveApiAssetUrl(pathOrUrl: string): string {
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) return pathOrUrl;
  return `${API_URL}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
}

export type ApiError = { error: string | Record<string, unknown> };

export async function apiFetch<T>(
  path: string,
  options: RequestInit & {
    token?: string | null;
    panelHeaders?: Record<string, string>;
  } = {}
): Promise<T> {
  const { token, panelHeaders, ...init } = options;
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (panelHeaders) {
    for (const [key, value] of Object.entries(panelHeaders)) {
      if (value) headers.set(key, value);
    }
  }
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers,
      credentials: "include",
    });
  } catch {
    throw new Error(
      `Cannot reach API at ${API_URL}. Start the backend with: npm run dev:api`
    );
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errBody = data as ApiError;
    let message: string;
    if (typeof errBody.error === "string") {
      message = errBody.error;
    } else if (errBody.error && typeof errBody.error === "object") {
      message = formatZodFlattenError(errBody.error as Record<string, unknown>) ?? "Request failed";
    } else {
      message = res.status === 401 ? "Please sign in again" : "Request failed";
    }
    throw Object.assign(new Error(message), { status: res.status, data });
  }
  return data as T;
}

function formatZodFlattenError(error: Record<string, unknown>): string | null {
  const fieldErrors = error.fieldErrors as Record<string, string[] | undefined> | undefined;
  if (fieldErrors && typeof fieldErrors === "object") {
    const parts: string[] = [];
    for (const [field, messages] of Object.entries(fieldErrors)) {
      if (messages?.[0]) parts.push(`${field}: ${messages[0]}`);
    }
    if (parts.length > 0) return parts.join(" · ");
  }
  const formErrors = error.formErrors as string[] | undefined;
  if (formErrors?.[0]) return formErrors[0];
  return null;
}

export function getApiErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    const data = (err as Error & { data?: { error?: unknown } }).data;
    if (data?.error && typeof data.error === "object" && data.error !== null) {
      const zodMsg = formatZodFlattenError(data.error as Record<string, unknown>);
      if (zodMsg) return zodMsg;
    }
    return err.message;
  }
  return "Something went wrong";
}
