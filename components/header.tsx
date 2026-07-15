import { Sparkles } from "lucide-react"

export function Header() {
  return (
    <section className="relative flex flex-col items-center gap-6 py-12 text-center sm:gap-8 sm:py-16">
      <div className="bg-grid mask-fade-b pointer-events-none absolute inset-0 -z-10 opacity-40" />
      <div
        className="pointer-events-none absolute top-0 left-1/2 -z-10 size-[480px] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--primary)), transparent 70%)",
        }}
      />

      <div className="animate-fade-in inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-muted-foreground">
        <Sparkles className="size-3 text-primary" />
        Détection propulsée par 4 modèles d&apos;IA
      </div>

      <h1 className="font-display animate-slide-up max-w-2xl text-3xl leading-tight font-extrabold tracking-tight text-balance text-foreground sm:text-5xl">
        Cette image est-elle
        <span className="mt-1 block bg-linear-to-r from-primary via-blue-500 to-chart-5 bg-clip-text text-transparent">
          réelle ou générée par IA ?
        </span>
      </h1>
    </section>
  )
}
