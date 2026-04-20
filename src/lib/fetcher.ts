/**
 * SWR fetcher that attaches Authorization: Bearer <userId> from storage.
 * This covers sessions created before the httpOnly cookie was introduced.
 * Once users re-login, the cookie takes over and this header is redundant but harmless.
 */
export function getAuthHeader(): HeadersInit {
  if (typeof window === "undefined") return {};
  try {
    const raw =
      localStorage.getItem("vaxcare_user") ??
      sessionStorage.getItem("vaxcare_user");
    if (!raw) return {};
    const user = JSON.parse(raw) as { id?: string };
    if (user?.id) return { Authorization: `Bearer ${user.id}` };
  } catch {}
  return {};
}

export const authedFetcher = (url: string) =>
  fetch(url, { headers: getAuthHeader() }).then((r) => {
    if (!r.ok) throw new Error("fetch_error");
    return r.json();
  });
