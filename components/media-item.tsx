import { MediaThumbnail } from "@/components/media-thumbnail"
import { Button } from "@/components/ui/button"
import { Media } from "@/lib/media/types"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

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
      <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary">
        <MediaThumbnail src={item.thumbnail} alt={`Aperçu de ${item.key}`} />
      </div>

      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium text-foreground">
            {item.key}
          </p>
          <span className="shrink-0 text-xs text-muted-foreground">
            {item.size}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
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
