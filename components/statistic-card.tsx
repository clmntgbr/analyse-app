import { cn } from "@/lib/utils"

export function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  color: string
}) {
  return (
    <div className="rounded-2xl border bg-card p-4">
      <Icon className={cn("size-4", color)} />
      <p className="font-display mt-2 text-2xl font-bold tabular-nums">
        {value}
      </p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}
