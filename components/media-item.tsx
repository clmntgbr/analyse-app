import { MediaThumbnail } from "@/components/media-thumbnail"
import { Badge } from "@/components/ui/badge"
import {
  Media,
  MediaConfidence,
  MediaStatus,
  MediaVerdict,
} from "@/lib/media/types"
import { cn } from "@/lib/utils"
import {
  Bot,
  CheckCircle2,
  FileVideo,
  HelpCircle,
  ImageIcon,
  Loader2,
  User,
} from "lucide-react"

interface MediaItemProps {
  item: Media
}

const statusLabel: Record<MediaStatus, string> = {
  pending: "Préparation…",
  processing: "Analyse en cours…",
  analyzed: "Analysé",
  error: "Erreur",
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
}

function isVideoKey(key: string): boolean {
  return /\.(mp4|mov|webm)$/i.test(key)
}

export function MediaItem({ item }: MediaItemProps) {
  const isVideo = isVideoKey(item.key)
  const isComplete = item.status === "analyzed" && item.verdict
  const isInProgress = !isComplete && item.status !== "error"
  const isError = item.status === "error"

  return (
    <li
      className={cn(
        "flex items-center gap-4 rounded-xl border bg-card p-4 transition-colors",
        isError && "border-destructive/40 bg-destructive/5",
        isInProgress && "border-primary/20"
      )}
    >
      <div className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary">
        {item.thumbnail ? (
          <MediaThumbnail
            src={item.thumbnail}
            alt={`Aperçu de ${item.key}`}
            className="size-full"
          />
        ) : isVideo ? (
          <FileVideo
            className="size-6 text-muted-foreground"
            aria-hidden="true"
          />
        ) : (
          <ImageIcon
            className="size-6 text-muted-foreground"
            aria-hidden="true"
          />
        )}
        {isInProgress && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-background/70"
            aria-hidden="true"
          >
            <Loader2 className="size-5 animate-spin text-primary" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium text-foreground">
            {item.key}
          </p>
        </div>

        {isComplete && item.verdict ? (
          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            {(() => {
              const cfg = verdictConfig[item.verdict]
              if (!cfg) return null

              const Icon = cfg.icon

              return (
                <Badge variant="outline" className={cn("gap-1", cfg.className)}>
                  <Icon className="size-3.5" aria-hidden="true" />
                  {cfg.label}
                </Badge>
              )
            })()}
            {item.finalScore !== undefined && (
              <Badge variant="secondary" className="tabular-nums">
                Score {item.finalScore.toFixed(1)}
              </Badge>
            )}
            {item.confidence && (
              <span className="text-xs text-muted-foreground">
                {confidenceLabel[item.confidence]}
              </span>
            )}
          </div>
        ) : isInProgress ? (
          <div className="flex items-center gap-2 pt-0.5">
            <Loader2
              className="size-3.5 shrink-0 animate-spin text-primary"
              aria-hidden="true"
            />
            <span className="text-xs text-muted-foreground">
              {statusLabel[item.status] ?? item.status}
            </span>
          </div>
        ) : isError ? (
          <p className="text-xs text-destructive">{statusLabel.error}</p>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {isComplete ? (
          <Badge variant="secondary" className="gap-1 text-primary">
            <CheckCircle2 className="size-3.5" aria-hidden="true" />
            {statusLabel.analyzed}
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className={cn(
              "gap-1",
              isInProgress && "text-primary",
              isError && "text-destructive"
            )}
          >
            {isInProgress && (
              <Loader2 className="size-3 animate-spin" aria-hidden="true" />
            )}
            {statusLabel[item.status] ?? item.status}
          </Badge>
        )}
      </div>
    </li>
  )
}
