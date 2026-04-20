/**
 * Performs a complete, irreversible session wipe:
 * - Calls server logout to clear httpOnly cookie
 * - Clears localStorage & sessionStorage entirely
 * - Replaces history so back-button can't return to protected pages
 */
export async function clearSession() {
  // 1. Clear httpOnly session cookie server-side
  try { await fetch("/api/auth/logout", { method: "POST" }); } catch {}

  // 2. Wipe all client storage
  try { localStorage.clear(); } catch {}
  try { sessionStorage.clear(); } catch {}

  // 3. Replace current history entry so back-button lands on login, not dashboard
  window.history.replaceState(null, "", "/login");
  window.location.replace("/login");
}
