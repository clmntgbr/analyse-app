export function InsightRow({
  label,
  value,
  description,
}: {
  label: string
  value: number
  description: string
}) {
  const colorVar =
    value >= 60
      ? "--color-red-500"
      : value >= 40
        ? "--color-yellow-500"
        : "--color-green-500"
  return (
    <div className="group rounded-xl border bg-card p-3 transition-colors hover:bg-accent/30">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-extrabold text-foreground">{label}</span>
        <span
          className="text-sm tabular-nums"
          style={{ color: `var(${colorVar})` }}
        >
          {value}
        </span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${value}%`,
            backgroundColor: `var(${colorVar})`,
          }}
        />
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
