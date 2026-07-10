import { createAuthHeaders } from "@/lib/create-auth-headers"
import { getBackendApiUrl } from "@/lib/get-backend-api-url"
import { requireAuth } from "@/lib/require-auth"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const auth = await requireAuth()
    if ("error" in auth) return auth.error

    const body = await request.json()

    const response = await fetch(
      `${getBackendApiUrl()}/api/media/presign-upload-url`,
      {
        method: "POST",
        headers: createAuthHeaders(auth.token),
        body: JSON.stringify(body),
      }
    )

    if (!response.ok) {
      return NextResponse.json(
        { success: false, data: await response.json() },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
