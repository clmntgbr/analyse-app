import { MediaThumbnail } from "@/components/media-thumbnail"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
  likely_human: {
    label: "Probablement humain",
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
  const isAnalyzed = item.status === "analyzed" && item.verdict
  const inProgress = item.status === "pending" || item.status === "processing"

  return (
    <li
      className={cn(
        "flex items-center gap-4 rounded-xl border bg-card p-4 transition-colors",
        item.status === "error" && "border-destructive/40 bg-destructive/5"
      )}
    >
      <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary">
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
      </div>

      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium text-foreground">
            {item.key}
          </p>
        </div>

        {isAnalyzed && item.verdict ? (
          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            {(() => {
              const cfg = verdictConfig[item.verdict]
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
        ) : inProgress ? (
          <div className="flex items-center gap-3">
            <Progress
              value={item.status === "processing" ? 66 : 33}
              className="h-1.5 flex-1"
              aria-label={`Progression de ${item.key}`}
            />
            <span className="w-9 shrink-0 text-right text-xs text-muted-foreground tabular-nums">
              {item.status === "processing" ? "66%" : "33%"}
            </span>
          </div>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {item.status === "analyzed" ? (
          <Badge variant="secondary" className="gap-1 text-primary">
            <CheckCircle2 className="size-3.5" aria-hidden="true" />
            {statusLabel.analyzed}
          </Badge>
        ) : (
          <Badge variant="outline" className="gap-1 text-muted-foreground">
            {inProgress && (
              <Loader2 className="size-3 animate-spin" aria-hidden="true" />
            )}
            {statusLabel[item.status]}
          </Badge>
        )}
      </div>
    </li>
  )
}
