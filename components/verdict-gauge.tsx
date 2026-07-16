import { VERDICT_COLOR_VAR } from "@/lib/media/analysis"
import { MediaVerdict } from "@/lib/media/types"
import { ScoreGauge } from "./score-gauge"

interface VerdictGaugeProps {
  verdict: MediaVerdict | undefined
  score: number | undefined
}

export function VerdictGauge({ verdict, score }: VerdictGaugeProps) {
  if (!verdict || !score) return null
  return (
    <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-between sm:gap-6">
      <ScoreGauge
        score={score}
        size={130}
        strokeWidth={11}
        colorVar={VERDICT_COLOR_VAR[verdict]}
      />
    </div>
  )
}
