export function createAuthHeaders(
  token: string,
  options?: { json?: boolean; accept?: string }
): Record<string, string> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "ngrok-skip-browser-warning": "1",
    "User-Agent": "analyse-app",
  }

  if (options?.json !== false) {
    headers["Content-Type"] = "application/json"
  }

  if (options?.accept) {
    headers["Accept"] = options.accept
  }

  return headers
}
