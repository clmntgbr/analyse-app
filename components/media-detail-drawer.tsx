"use client"

import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer"
import { useMedia } from "@/lib/media/context"
import type { Media } from "@/lib/media/types"
import { useEffect, useState } from "react"
import { VerdictGauge } from "./verdict-gauge"

interface MediaDetailDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mediaId: string
}

export function MediaDetailDrawer({
  open,
  onOpenChange,
  mediaId,
}: MediaDetailDrawerProps) {
  const { fetchMedia } = useMedia()
  const [item, setItem] = useState<Media | null>(null)

  useEffect(() => {
    if (!open || !mediaId) return

    let cancelled = false

    fetchMedia(mediaId).then((media) => {
      if (!cancelled) setItem(media)
    })

    return () => {
      cancelled = true
    }
  }, [open, mediaId, fetchMedia])

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="flex h-full w-[30vw]! max-w-[30vw]! flex-col gap-0 overflow-hidden p-0!">
        <DrawerTitle className="sr-only">
          {item?.key ?? "Détail du média"}
        </DrawerTitle>
        {item && (
          <>
            <VerdictGauge verdict={item.verdict} score={item.finalScore} />
          </>
        )}
      </DrawerContent>
    </Drawer>
  )
}
