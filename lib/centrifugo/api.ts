export async function getCentrifugoToken(): Promise<string> {
  const response = await fetch("/api/realtime/connection", {
    method: "GET",
  })

  if (!response.ok) {
    throw new Error("Failed to fetch realtime connection token")
  }

  const data = (await response.json()) as { token?: string }

  if (!data.token) {
    throw new Error("Missing realtime connection token in response")
  }

  return data.token
}
