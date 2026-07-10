import { createAuthHeaders } from "@/lib/create-auth-headers"
import { requireAuth } from "@/lib/require-auth"
import { NextResponse } from "next/server"

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth()
    if ("error" in auth) return auth.error

    const { id } = await params

    const response = await fetch(
      `${BACKEND_API_URL}/api/medias/${id}/thumbnail`,
      {
        method: "GET",
        headers: createAuthHeaders(auth.token, { json: false }),
        cache: "no-store",
      }
    )

    if (!response.ok) {
      return new NextResponse(null, { status: response.status })
    }

    return new NextResponse(response.body, {
      headers: {
        "Content-Type": response.headers.get("content-type") ?? "image/jpeg",
        "Cache-Control": "public, max-age=86400",
      },
    })
  } catch (error) {
    console.error("Thumbnail proxy error:", error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
