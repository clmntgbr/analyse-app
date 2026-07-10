import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface MediaThumbnailProps {
  src: string
  alt: string
  className?: string
}

export function MediaThumbnail({ src, alt, className }: MediaThumbnailProps) {
  if (!src) {
    return (
      <div
        className={cn(
          "flex size-full items-center justify-center",
          className
        )}
        aria-label={`Chargement de ${alt}`}
      >
        <Loader2
          className="size-5 animate-spin text-muted-foreground"
          aria-hidden="true"
        />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cn("size-full object-cover", className)}
      width={48}
      height={48}
    />
  )
}
