import { createAuthHeaders } from "@/lib/create-auth-headers"
import { getBackendApiUrl } from "@/lib/get-backend-api-url"
import { requireAuth } from "@/lib/require-auth"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const auth = await requireAuth()
    if ("error" in auth) return auth.error

    const response = await fetch(
      `${getBackendApiUrl()}/api/realtime/connection`,
      {
        method: "GET",
        headers: createAuthHeaders(auth.token),
        cache: "no-store",
      }
    )

    if (!response.ok) {
      return NextResponse.json(
        { success: false },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Realtime connection token error:", error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
