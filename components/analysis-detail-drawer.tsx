"use client"

import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer"
import {
  getAnalysisDisplayName,
  getInsightEntries,
} from "@/lib/analysis/config"
import { useAnalysis } from "@/lib/analysis/context"
import type { Analysis } from "@/lib/analysis/types"
import { useEffect, useState } from "react"
import { InsightRow } from "./insight-row"
import { VerdictGauge } from "./verdict-gauge"

interface AnalysisDetailDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  analysisId: string
}

export function AnalysisDetailDrawer({
  open,
  onOpenChange,
  analysisId,
}: AnalysisDetailDrawerProps) {
  const { fetchAnalysis } = useAnalysis()
  const [item, setItem] = useState<Analysis | null>(null)

  useEffect(() => {
    if (!open || !analysisId) return

    let cancelled = false

    fetchAnalysis(analysisId).then((analysis) => {
      if (!cancelled) setItem(analysis)
    })

    return () => {
      cancelled = true
    }
  }, [open, analysisId, fetchAnalysis])

  const insights = item?.medias.flatMap((media) =>
    media.insight
      ? getInsightEntries(media.insight).map((insight) => ({
          ...insight,
          key: `${media.id}-${insight.key}`,
        }))
      : []
  )

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="flex h-full w-[40vw]! max-w-[40vw]! flex-col gap-0 overflow-hidden p-6">
        <DrawerTitle className="sr-only">
          {item ? getAnalysisDisplayName(item) : "Détail de l'analyse"}
        </DrawerTitle>
        {item && (
          <>
            <VerdictGauge verdict={item.verdict} score={item.finalScore} />
            <div className="grid grid-cols-2 gap-4">
              {insights?.map((insight) => (
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
