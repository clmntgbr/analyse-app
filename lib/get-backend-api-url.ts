export function getBackendApiUrl(): string {
  const directUrl = process.env.BACKEND_API_URL
  if (directUrl) {
    return normalizeBackendUrl(directUrl)
  }

  const publicUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL

  if (!publicUrl) {
    throw new Error("Missing BACKEND_API_URL or NEXT_PUBLIC_BACKEND_API_URL")
  }

  return normalizeBackendUrl(publicUrl)
}

function normalizeBackendUrl(url: string): string {
  return url.replace("://localhost", "://127.0.0.1")
}
