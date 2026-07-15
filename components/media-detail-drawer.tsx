"use client"

import { MediaThumbnail } from "@/components/media-thumbnail"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Progress } from "@/components/ui/progress"
import { useMedia } from "@/lib/media/context"
import { Media, MediaConfidence, MediaVerdict } from "@/lib/media/types"
import { cn } from "@/lib/utils"
import { Bot, HelpCircle, Loader2, User } from "lucide-react"
import { useEffect, useState, type ReactNode } from "react"

interface MediaDetailDrawerProps {
  mediaId: string
  fileName?: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

const verdictConfig: Record<
  MediaVerdict,
  { label: string; icon: typeof Bot; className: string }
> = {
  likely_ai: {
    label: "Probablement IA",
    icon: Bot,
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  likely_real: {
    label: "Probablement réel",
    icon: User,
    className: "bg-primary/10 text-primary border-primary/20",
  },
  uncertain: {
    label: "Incertain",
    icon: HelpCircle,
    className: "bg-muted text-muted-foreground border-border",
  },
}

const confidenceLabel: Record<MediaConfidence, string> = {
  low: "Confiance faible",
  medium: "Confiance moyenne",
  high: "Confiance élevée",
  unknown: "Confiance inconnue",
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("fr-FR", {
      dateStyle: "medium",
      timeStyle: "short",
    })
  } catch {
    return iso
  }
}

function MetaRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <span className="shrink-0 text-sm text-muted-foreground">{label}</span>
      <span className="min-w-0 text-right text-sm font-medium text-foreground">
        {value}
      </span>
    </div>
  )
}

export function MediaDetailDrawer({
  mediaId,
  fileName,
  open,
  onOpenChange,
}: MediaDetailDrawerProps) {
  const { fetchMedia } = useMedia()
  const [media, setMedia] = useState<Media | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return

    let cancelled = false

    const loadMedia = async () => {
      setIsLoading(true)
      setError(null)
      setMedia(null)

      try {
        const data = await fetchMedia(mediaId)
        if (!cancelled) setMedia(data)
      } catch {
        if (!cancelled) setError("Impossible de charger le média")
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    loadMedia()

    return () => {
      cancelled = true
    }
  }, [open, mediaId, fetchMedia])

  const isAnalyzed = media?.status === "analyzed" && media.verdict
  const cfg = media?.verdict ? verdictConfig[media.verdict] : null
  const Icon = cfg?.icon
  const signals = media?.signals ?? []
  const title = fileName ?? media?.key ?? "Détail du média"

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="flex h-full w-[30vw]! max-w-[30vw]! flex-col">
        <DrawerHeader className="border-b px-5 pb-4">
          <DrawerTitle className="truncate text-left text-base font-semibold">
            {title}
          </DrawerTitle>
          <DrawerDescription className="text-left">
            Résultat de l&apos;analyse et signaux détectés
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex min-h-0 flex-1 flex-col overflow-auto">
          <div className="space-y-4 px-5 py-5">
            {isLoading ? (
              <Card>
                <CardContent className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Chargement…
                </CardContent>
              </Card>
            ) : error ? (
              <Card>
                <CardContent className="py-16 text-center text-sm font-medium text-destructive">
                  {error}
                </CardContent>
              </Card>
            ) : media ? (
              <>
                {media.thumbnail && (
                  <Card className="overflow-hidden py-0">
                    <CardContent className="px-0">
                      <MediaThumbnail
                        src={media.thumbnail}
                        alt={title}
                        className="max-h-72 w-full object-contain"
                      />
                    </CardContent>
                  </Card>
                )}

                {isAnalyzed && cfg && Icon && media.finalScore !== undefined ? (
                  <Card>
                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant="outline"
                          className={cn("gap-1", cfg.className)}
                        >
                          <Icon className="size-3.5" aria-hidden="true" />
                          {cfg.label}
                        </Badge>
                        <Badge variant="secondary" className="tabular-nums">
                          Score {media.finalScore.toFixed(1)}
                        </Badge>
                        {media.confidence && (
                          <span className="text-xs text-muted-foreground">
                            {confidenceLabel[media.confidence]}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="size-4 animate-spin text-primary" />
                      <span className="font-medium">Analyse en cours…</span>
                    </CardContent>
                  </Card>
                )}

                {signals.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-foreground">
                      Signaux ({signals.length})
                    </p>
                    <ul className="space-y-3">
                      {signals.map((signal, index) => (
                        <li key={`${signal.id || signal.name}-${index}`}>
                          <Card>
                            <CardHeader className="pb-0">
                              <div className="flex items-start justify-between gap-3">
                                <CardTitle className="font-semibold">
                                  {signal.name}
                                </CardTitle>
                                <div className="flex shrink-0 items-center gap-2">
                                  <Badge
                                    variant="secondary"
                                    className="font-semibold tabular-nums"
                                  >
                                    {signal.score}
                                  </Badge>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <span className="text-xs text-muted-foreground">
                                {confidenceLabel[signal.confidence]}
                              </span>
                              <Progress
                                value={Math.min(100, signal.score)}
                                className="h-1.5"
                              />
                              {signal.details.length > 0 && (
                                <ul className="space-y-1.5 border-t pt-3">
                                  {signal.details.map((detail, index) => (
                                    <li
                                      key={index}
                                      className="text-sm leading-relaxed text-muted-foreground"
                                    >
                                      {detail}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </CardContent>
                          </Card>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle className="font-semibold">
                      Informations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="divide-y pt-0">
                    <MetaRow
                      label="Statut"
                      value={<span className="capitalize">{media.status}</span>}
                    />
                    <MetaRow
                      label="Créé le"
                      value={formatDate(media.createdAt)}
                    />
                    <MetaRow
                      label="Mis à jour"
                      value={formatDate(media.updatedAt)}
                    />
                    <MetaRow
                      label="Identifiant"
                      value={
                        <span className="text-xs font-normal">{media.id}</span>
                      }
                    />
                    <MetaRow
                      label="Fichier"
                      value={
                        <span className="text-xs font-normal">{media.key}</span>
                      }
                    />
                  </CardContent>
                </Card>
              </>
            ) : null}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
