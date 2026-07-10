import { createAuthHeaders } from "@/lib/create-auth-headers"
import { requireAuth } from "@/lib/require-auth"
import { NextResponse } from "next/server"

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth()
    if ("error" in auth) return auth.error

    const { id } = await params

    console.log(id)

    const response = await fetch(
      `${BACKEND_API_URL}/api/medias/${id}/thumbnail`,
      {
        method: "GET",
        headers: createAuthHeaders(auth.token),
      }
    )

    if (!response.ok) {
      return NextResponse.json(
        { success: false, data: await response.json() },
        { status: response.status }
      )
    }

    const contentType =
      response.headers.get("content-type") ?? "application/octet-stream"
    const imageBuffer = await response.arrayBuffer()

    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, max-age=3600",
      },
    })
  } catch {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
