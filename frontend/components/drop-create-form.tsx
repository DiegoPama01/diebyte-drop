"use client"

import { useMemo, useState } from "react"
import { CheckCircle2Icon, CopyIcon, LoaderCircleIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

type DropResponse = {
  public_id: string
  content: string
  expires_at: string
  created_at: string
  burn_after_reading: boolean
  share_url: string
}

const expirationOptions = [
  { value: "10m", label: "10 minutos" },
  { value: "1h", label: "1 hora" },
  { value: "24h", label: "24 horas" },
  { value: "7d", label: "7 dias" },
]

export function DropCreateForm() {
  const [content, setContent] = useState("")
  const [expiration, setExpiration] = useState("24h")
  const [burnAfterReading, setBurnAfterReading] = useState(false)
  const [result, setResult] = useState<DropResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [copied, setCopied] = useState(false)

  const isDisabled = useMemo(() => !content.trim() || isSubmitting, [content, isSubmitting])

  function handleExpirationChange(value: string | null) {
    setExpiration(value ?? "24h")
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setError(null)
    setCopied(false)
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/drops", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          language: "text",
          expiration,
          burn_after_reading: burnAfterReading,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || "No se pudo crear el drop.")
      }

      setResult(data)
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "No se pudo crear el drop."
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleCopy() {
    if (!result) {
      return
    }

    await navigator.clipboard.writeText(result.share_url)
    setCopied(true)
  }

  function handleCreateAnother() {
    setContent("")
    setExpiration("24h")
    setBurnAfterReading(false)
    setResult(null)
    setError(null)
    setCopied(false)
  }

  if (result) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2Icon className="size-5 text-primary" />
            Drop creado correctamente
          </CardTitle>
          <CardDescription>
            Ya tienes tu enlace listo para compartir.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="share-url">URL del drop</Label>
            <div className="rounded-md border px-3 py-3 font-mono text-sm break-all">
              {result.share_url}
            </div>
          </div>

          <div className="grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
            <div className="rounded-md border p-3">
              <p className="font-medium text-foreground">ID</p>
              <p>{result.public_id}</p>
            </div>
            <div className="rounded-md border p-3">
              <p className="font-medium text-foreground">Expira</p>
              <p>{new Date(result.expires_at).toLocaleString()}</p>
            </div>
            <div className="rounded-md border p-3">
              <p className="font-medium text-foreground">Lectura unica</p>
              <p>{result.burn_after_reading ? "Si" : "No"}</p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <Button variant="outline" onClick={handleCreateAnother}>
            Crear otro drop
          </Button>
          <Button onClick={handleCopy}>
            <CopyIcon />
            {copied ? "URL copiada" : "Copiar URL"}
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nuevo drop</CardTitle>
      </CardHeader>

      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="drop-content">Contenido</Label>
            <Textarea
              id="drop-content"
              name="content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Escribe aqui el contenido del drop..."
              className="min-h-64 resize-y"
            />
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="grid gap-4 md:flex-1 md:grid-cols-[minmax(0,220px)_minmax(0,1fr)] md:items-end">
              <div className="space-y-2">
                <Label htmlFor="drop-expiration">Expiracion</Label>
                <Select name="expiration" value={expiration} onValueChange={handleExpirationChange}>
                  <SelectTrigger id="drop-expiration" className="w-full">
                    <SelectValue placeholder="Selecciona la duracion" />
                  </SelectTrigger>
                  <SelectContent>
                    {expirationOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex min-h-10 items-center gap-3">
                <Checkbox
                  id="burn-after-reading"
                  name="burnAfterReading"
                  checked={burnAfterReading}
                  onCheckedChange={setBurnAfterReading}
                  className="border-0 shadow-none"
                />
                <div>
                  <Label htmlFor="burn-after-reading">Quemar despues de leer</Label>
                </div>
              </div>
            </div>

            <Button type="submit" size="lg" className="md:self-end" disabled={isDisabled}>
              {isSubmitting ? (
                <>
                  <LoaderCircleIcon className="animate-spin" />
                  Creando...
                </>
              ) : (
                "Crear drop"
              )}
            </Button>
          </div>

          {error ? (
            <div className="rounded-md border border-destructive/30 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          ) : null}
        </form>
      </CardContent>
    </Card>
  )
}
