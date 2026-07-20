"use client"

import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer"
import { getInsightEntries } from "@/lib/media/analysis"
import { useMedia } from "@/lib/media/context"
import type { Media } from "@/lib/media/types"
import { useEffect, useState } from "react"
import { InsightRow } from "./insight-row"
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
      <DrawerContent className="flex h-full w-[40vw]! max-w-[40vw]! flex-col gap-0 overflow-hidden p-6">
        <DrawerTitle className="sr-only">
          {item?.key ?? "Détail du média"}
        </DrawerTitle>
        {item && (
          <>
            <VerdictGauge verdict={item.verdict} score={item.finalScore} />
            <div className="grid grid-cols-2 gap-4">
              {item.insight &&
                getInsightEntries(item.insight).map((insight) => (
                  <InsightRow
                    key={insight.key}
                    label={insight.label}
                    value={insight.value}
                    description={insight.description}
                    help={insight.help}
                  />
                ))}
            </div>
          </>
        )}
      </DrawerContent>
    </Drawer>
  )
}
