import { cn } from "@/lib/utils"

interface ScoreGaugeProps {
  score: number
  size?: number
  strokeWidth?: number
  colorVar?: string
}

export function ScoreGauge({
  score,
  size = 44,
  strokeWidth = 4,
  colorVar = "--primary",
}: ScoreGaugeProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset =
    circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference

  return (
    <div
      className={cn("relative inline-flex items-center justify-center")}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`var(${colorVar})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-bold tabular-nums"
          style={{ fontSize: size * 0.22 }}
        >
          {score.toFixed(1)}
        </span>
        <span
          className="text-muted-foreground"
          style={{ fontSize: size * 0.1 }}
        >
          / 100
        </span>
      </div>
    </div>
  )
}
