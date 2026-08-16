import { NextResponse } from "next/server"

const apiBaseUrl = process.env.DROP_API_BASE_URL || "http://127.0.0.1:8000/api"

type RouteContext = {
  params: Promise<{
    publicId: string
  }>
}

export async function GET(_: Request, context: RouteContext) {
  try {
    const { publicId } = await context.params

    const response = await fetch(`${apiBaseUrl}/drops/${publicId}/`, {
      cache: "no-store",
    })

    const responseText = await response.text()
    const data = responseText ? JSON.parse(responseText) : null

    return NextResponse.json(data ?? {}, { status: response.status })
  } catch {
    return NextResponse.json(
      {
        detail: "No se pudo conectar con el backend de drops.",
      },
      { status: 502 }
    )
  }
}
