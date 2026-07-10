import { createAuthHeaders } from "@/lib/create-auth-headers"
import { getBackendApiUrl } from "@/lib/get-backend-api-url"
import { requireAuth } from "@/lib/require-auth"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const auth = await requireAuth()
    if ("error" in auth) return auth.error

    const response = await fetch(`${getBackendApiUrl()}/api/medias`, {
      method: "GET",
      headers: createAuthHeaders(auth.token),
    })

    if (!response.ok) {
      return NextResponse.json({ success: false }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
