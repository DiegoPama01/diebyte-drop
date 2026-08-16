import { NextResponse } from "next/server"

const apiBaseUrl = process.env.DROP_API_BASE_URL || "http://127.0.0.1:8000/api"
const publicBaseUrl = process.env.DROP_PUBLIC_BASE_URL || "http://127.0.0.1:3000"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const response = await fetch(`${apiBaseUrl}/drops/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    })

    const responseText = await response.text()
    const data = responseText ? JSON.parse(responseText) : null

    if (!response.ok) {
      return NextResponse.json(data ?? { detail: "Error en el backend de drops." }, { status: response.status })
    }

    return NextResponse.json({
      ...data,
      share_url: `${publicBaseUrl}/drops/${data.public_id}`,
    })
  } catch {
    return NextResponse.json(
      {
        detail: "No se pudo conectar con el backend de drops.",
      },
      { status: 502 }
    )
  }
}
