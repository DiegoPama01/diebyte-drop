import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type DropData = {
  public_id: string
  content: string
  language: string
  created_at: string
  expires_at: string
  burn_after_reading: boolean
  detail?: string
}

type PageProps = {
  params: Promise<{
    publicId: string
  }>
}

async function getDrop(publicId: string) {
  const apiBaseUrl = process.env.DROP_API_BASE_URL || "http://127.0.0.1:8000/api"

  const response = await fetch(`${apiBaseUrl}/drops/${publicId}/`, {
    cache: "no-store",
  })

  const responseText = await response.text()
  const data = responseText ? (JSON.parse(responseText) as DropData) : null

  return {
    ok: response.ok,
    status: response.status,
    data,
  }
}

export default async function DropPage({ params }: PageProps) {
  const { publicId } = await params
  const result = await getDrop(publicId)

  if (!result.ok || !result.data) {
    const message =
      result.status === 404
        ? "Este drop no existe o ya no esta disponible."
        : result.status === 410
          ? "Este drop ha expirado."
          : result.data?.detail || "No se pudo cargar el drop."

    return (
      <main className="min-h-svh px-4 py-10 md:px-6">
        <div className="mx-auto w-full max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle>Drop no disponible</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{message}</p>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-svh px-4 py-10 md:px-6">
      <div className="mx-auto w-full max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Drop</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border px-3 py-3 font-mono text-sm whitespace-pre-wrap break-words">
              {result.data.content}
            </div>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground md:flex-row md:justify-between">
              <span>Expira: {new Date(result.data.expires_at).toLocaleString()}</span>
              <span>Lectura unica: {result.data.burn_after_reading ? "Si" : "No"}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
