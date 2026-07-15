"use client"

import { MediaThumbnail } from "@/components/media-thumbnail"
import { Badge } from "@/components/ui/badge"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Progress } from "@/components/ui/progress"
import { useMedia } from "@/lib/media/context"
import { Media, MediaConfidence, MediaVerdict } from "@/lib/media/types"
import { cn } from "@/lib/utils"
import { Bot, HelpCircle, Loader2, ShieldCheck } from "lucide-react"
import { useEffect, useState } from "react"

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
    label: "Probablement authentique",
    icon: ShieldCheck,
    className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  },
  uncertain: {
    label: "Incertain",
    icon: HelpCircle,
    className: "bg-muted text-muted-foreground border-border",
  },
}

const confidenceLabel: Record<MediaConfidence, string> = {
  low: "faible",
  medium: "moyenne",
  high: "élevée",
  unknown: "inconnue",
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("fr-FR", {
      dateStyle: "short",
      timeStyle: "medium",
    })
  } catch {
    return iso
  }
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

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="flex h-full w-[30vw]! max-w-[30vw]! flex-col">
        <DrawerHeader className="hidden">
          <DrawerTitle className="hidden truncate text-left">
            {fileName ?? media?.key ?? "Détail du média"}
          </DrawerTitle>
        </DrawerHeader>

        <div className="flex min-h-0 flex-1 flex-col overflow-auto">
          <div className="space-y-6 px-4 py-4">
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Chargement…
              </div>
            ) : error ? (
              <p className="py-12 text-center text-sm text-destructive">
                {error}
              </p>
            ) : media ? (
              <>
                {media.thumbnail && (
                  <div className="overflow-hidden rounded-lg border bg-secondary">
                    <MediaThumbnail
                      src={media.thumbnail}
                      alt={fileName ?? media.key}
                      className="max-h-64 w-full object-contain"
                    />
                  </div>
                )}

                {isAnalyzed && cfg && Icon && media.finalScore !== undefined ? (
                  <div className="rounded-xl border bg-card p-4">
                    <div className="flex items-center justify-between gap-3">
                      <Badge
                        variant="outline"
                        className={cn("gap-1.5", cfg.className)}
                      >
                        <Icon className="size-4" aria-hidden="true" />
                        {cfg.label}
                      </Badge>
                      {media.confidence && (
                        <span className="text-xs text-muted-foreground">
                          Confiance {confidenceLabel[media.confidence]}
                        </span>
                      )}
                    </div>
                    <div className="mt-4">
                      <div className="mb-1 flex items-baseline justify-between">
                        <span className="text-xs tracking-wide text-muted-foreground uppercase">
                          Score final
                        </span>
                        <span className="font-display text-2xl font-bold text-foreground tabular-nums">
                          {media.finalScore.toFixed(1)}
                        </span>
                      </div>
                      <Progress
                        value={Math.min(100, media.finalScore)}
                        className="h-2"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 rounded-xl border bg-card p-4 text-sm text-muted-foreground">
                    <Loader2 className="size-4 animate-spin text-primary" />
                    Analyse en cours…
                  </div>
                )}

                {signals.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                      Signaux ({signals.length})
                    </h3>
                    <ul className="space-y-3">
                      {signals.map((signal) => (
                        <li
                          key={signal.id}
                          className="rounded-lg border bg-card p-4"
                        >
                          <div className="mb-2 flex items-center justify-between gap-2">
                            <p className="font-mono text-sm font-medium text-foreground">
                              {signal.name}
                            </p>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="secondary"
                                className="tabular-nums"
                              >
                                {signal.score}
                              </Badge>
                              <span className="text-[11px] text-muted-foreground">
                                conf. {confidenceLabel[signal.confidence]}
                              </span>
                            </div>
                          </div>
                          <Progress
                            value={Math.min(100, signal.score)}
                            className="mb-3 h-1.5"
                          />
                          {signal.details.length > 0 && (
                            <ul className="space-y-1">
                              {signal.details.map((detail, index) => (
                                <li
                                  key={index}
                                  className="font-mono text-[11px] leading-relaxed text-muted-foreground"
                                >
                                  • {detail}
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <dl className="grid grid-cols-1 gap-3 rounded-lg border bg-card p-4 text-xs sm:grid-cols-2">
                  <div>
                    <dt className="text-muted-foreground">ID</dt>
                    <dd className="mt-0.5 truncate font-mono text-foreground">
                      {media.id}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Clé</dt>
                    <dd className="mt-0.5 truncate font-mono text-foreground">
                      {media.key}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Statut</dt>
                    <dd className="mt-0.5 font-mono text-foreground">
                      {media.status}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Créé le</dt>
                    <dd className="mt-0.5 text-foreground">
                      {formatDate(media.createdAt)}
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-muted-foreground">Mis à jour</dt>
                    <dd className="mt-0.5 text-foreground">
                      {formatDate(media.updatedAt)}
                    </dd>
                  </div>
                </dl>
              </>
            ) : null}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
