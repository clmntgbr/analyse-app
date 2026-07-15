"use client"

import { MediaDetailDrawer } from "@/components/media-detail-drawer"
import { ScoreGauge } from "@/components/score-gauge"
import { Progress } from "@/components/ui/progress"
import {
  CONFIDENCE_LABEL,
  VERDICT_COLOR_VAR,
  VERDICT_CONFIG,
  getMediaProgress,
  isVideoMedia,
} from "@/lib/media/analysis"
import { Media, MediaVerdict } from "@/lib/media/types"
import { cn } from "@/lib/utils"
import {
  Bot,
  Check,
  FileVideo,
  HelpCircle,
  Loader2,
  ShieldCheck,
  User,
} from "lucide-react"
import { useState } from "react"

const ICONS = {
  "shield-check": ShieldCheck,
  user: User,
  "help-circle": HelpCircle,
  bot: Bot,
}

interface MediaItemProps {
  item: Media
}

export function MediaItem({ item }: MediaItemProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const isVideo = isVideoMedia(item.key)
  const isComplete = item.status === "analyzed" && item.verdict
  const isAnalyzing = item.status === "pending" || item.status === "processing"
  const isError = item.status === "error"
  const progress = getMediaProgress(item.status)
  const cfg = item.verdict ? VERDICT_CONFIG[item.verdict] : null

  const openDrawer = () => {
    if (isComplete) setDrawerOpen(true)
  }

  return (
    <>
      <div
        className={cn(
          "group relative flex cursor-pointer items-center gap-4 rounded-2xl border bg-card p-3 transition-all duration-200",
          "hover:shadow-sm",
          isAnalyzing && "border-primary/40",
          isError && "border-destructive/40"
        )}
        onClick={openDrawer}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if ((event.key === "Enter" || event.key === " ") && isComplete) {
            event.preventDefault()
            openDrawer()
          }
        }}
      >
        <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-secondary">
          {item.thumbnail ? (
            <img
              src={item.thumbnail}
              alt={`Aperçu de ${item.key}`}
              className="size-full object-cover"
            />
          ) : isVideo ? (
            <div className="flex size-full flex-col items-center justify-center gap-1 text-muted-foreground">
              <FileVideo className="size-5" />
              <span className="text-[0.6rem] font-medium">VIDEO</span>
            </div>
          ) : (
            <Bot className="size-5 text-muted-foreground" />
          )}
          {isAnalyzing && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <Loader2 className="size-5 animate-spin text-white" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <p className="truncate text-sm font-medium text-foreground">
            {item.key}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            {isComplete &&
            cfg &&
            item.verdict &&
            item.finalScore !== undefined ? (
              <>
                <VerdictBadge verdict={item.verdict} />
                <ScorePill score={item.finalScore} verdict={item.verdict} />
                {item.confidence && (
                  <span className="text-xs text-muted-foreground">
                    Confiance {CONFIDENCE_LABEL[item.confidence]}
                  </span>
                )}
              </>
            ) : isAnalyzing ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-primary">
                  {item.status === "processing"
                    ? "Analyse en cours…"
                    : "Préparation…"}
                </span>
                <Progress value={progress} className="h-1.5 w-24" />
              </div>
            ) : isError ? (
              <span className="text-xs font-medium text-destructive">
                Erreur d&apos;analyse
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">
                En file d&apos;attente…
              </span>
            )}
          </div>
        </div>

        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          {isComplete ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[0.625rem] font-medium text-primary">
              <Check className="size-3" />
              Analysé
            </span>
          ) : isAnalyzing ? (
            <ScoreGauge
              score={progress}
              size={44}
              strokeWidth={4}
              colorVar="--primary"
            />
          ) : null}
        </div>
      </div>

      <MediaDetailDrawer
        mediaId={item.id}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </>
  )
}

function VerdictBadge({ verdict }: { verdict: MediaVerdict }) {
  const cfg = VERDICT_CONFIG[verdict]
  const Icon = ICONS[cfg.icon]

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[0.625rem] font-semibold",
        cfg.bg,
        cfg.color,
        cfg.border
      )}
    >
      <Icon className="size-3" />
      {cfg.short}
    </span>
  )
}

function ScorePill({
  score,
  verdict,
}: {
  score: number
  verdict: MediaVerdict
}) {
  const colorVar = VERDICT_COLOR_VAR[verdict]

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.625rem] font-medium tabular-nums"
      style={{
        backgroundColor: `color-mix(in oklch, var(${colorVar}) 10%, transparent)`,
        color: `var(${colorVar})`,
      }}
    >
      Score {score.toFixed(1)}
    </span>
  )
}
