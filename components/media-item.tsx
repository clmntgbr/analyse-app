import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MediaThumbnail } from "@/components/media-thumbnail"
import { Progress } from "@/components/ui/progress"
import { Media } from "@/lib/media/types"
import { cn } from "@/lib/utils"
import { Loader2, X } from "lucide-react"

interface MediaItemProps {
  item: Media
}

export function MediaItem({ item }: MediaItemProps) {
  return (
    <li
      className={cn(
        "flex items-center gap-4 rounded-xl border bg-card p-4 transition-colors"
      )}
    >
      {/* Vignette */}
      <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary">
        <MediaThumbnail
          src={item.thumbnail}
          alt={`Aperçu de ${item.key}`}
        />
      </div>

      {/* Infos + progression */}
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium text-foreground">
            {item.key}
          </p>
          <span className="shrink-0 text-xs text-muted-foreground">
            {item.size}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Progress
            value={100}
            className="h-1.5 flex-1"
            aria-label={`Progression de ${item.key}`}
          />
          <span className="w-9 shrink-0 text-right text-xs text-muted-foreground tabular-nums">
            100%
          </span>
        </div>
      </div>

      {/* Statut */}
      <div className="flex shrink-0 items-center gap-2">
        <Badge variant="outline" className="gap-1 text-muted-foreground">
          <Loader2 className="size-3 animate-spin" aria-hidden="true" />
        </Badge>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Retirer ${item.key}`}
          className="text-muted-foreground hover:text-destructive"
        >
          <X className="size-4" />
        </Button>
      </div>
    </li>
  )
}
