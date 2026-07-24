"use client"

import { PageHero } from "@/components/page-hero"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  formatBytes,
  formatCount,
  formatPrice,
  formatRetention,
} from "@/lib/plan/pricing"
import { createBillingPortalSession } from "@/lib/subscription/api"
import { useSubscription } from "@/lib/subscription/context"
import { cn } from "@/lib/utils"
import {
  ArrowUpRight,
  CalendarClock,
  CreditCard,
  ExternalLink,
  FileStack,
  HardDrive,
  Loader2,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Video,
} from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

const STATUS_LABELS: Record<string, string> = {
  active: "Actif",
  trialing: "Essai",
  past_due: "Paiement en retard",
  canceled: "Annulé",
  cancelled: "Annulé",
  unpaid: "Impayé",
  incomplete: "Incomplet",
  incomplete_expired: "Expiré",
}

const STATUS_BG: Record<string, string> = {
  active: "border-success/30 bg-success/10 text-success",
  trialing: "border-primary/30 bg-primary/10 text-primary",
  past_due: "border-warning/30 bg-warning/10 text-warning",
  unpaid: "border-destructive/30 bg-destructive/10 text-destructive",
  canceled: "border-border bg-muted text-muted-foreground",
  cancelled: "border-border bg-muted text-muted-foreground",
  incomplete: "border-warning/30 bg-warning/10 text-warning",
  incomplete_expired: "border-border bg-muted text-muted-foreground",
}

interface SubscriptionPageProps {
  onGoPricing: () => void
  onGoDetect: () => void
}

export function SubscriptionPage({
  onGoPricing,
  onGoDetect,
}: SubscriptionPageProps) {
  const { subscription, isLoading, fetchSubscription } = useSubscription()
  const [portalLoading, setPortalLoading] = useState(false)

  useEffect(() => {
    void fetchSubscription()
  }, [fetchSubscription])

  const handleOpenPortal = async () => {
    setPortalLoading(true)
    try {
      const { url } = await createBillingPortalSession()
      window.location.assign(url)
    } catch {
      toast.error("Impossible d'ouvrir le portail client", {
        description: "Veuillez réessayer dans un instant.",
      })
      setPortalLoading(false)
    }
  }

  if (isLoading && !subscription) {
    return (
      <div className="container mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-32">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          Chargement de votre abonnement…
        </p>
      </div>
    )
  }

  const plan = subscription?.effectivePlan ?? subscription?.plan ?? null

  if (!subscription || !plan) {
    return (
      <div className="container mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-32 text-center">
        <p className="text-sm text-muted-foreground">Aucun abonnement trouvé.</p>
        <Button onClick={onGoPricing}>Voir les plans</Button>
      </div>
    )
  }

  const quota = plan.quota
  const usage = subscription.quotaUsage

  const periodStart = usage?.periodStart ?? subscription.startDate
  const periodEnd = usage?.periodEnd ?? subscription.endDate
  const remainingDays = daysUntil(periodEnd)
  const cycleProgress = computeCycleProgress(periodStart, periodEnd)

  const imagesUsed = usage?.imagesUsed ?? 0
  const imagesMax = usage?.imagesMax ?? quota.maxImagesPerMonth
  const videosUsed = usage?.videosUsed ?? 0
  const videosMax = usage?.videosMax ?? quota.maxVideosPerMonth

  const hasPortal = Boolean(subscription.stripeCustomerId)

  return (
    <div className="container mx-auto max-w-6xl p-4 pb-20">
      {/* ── Hero ── */}
      <PageHero
        badge="Votre espace abonnement"
        title="Gérez votre"
        highlight="abonnement en un coup d'œil"
      />

      {/* ── Plan banner ── */}
      <section className="animate-slide-up relative overflow-hidden rounded-3xl border border-primary/20">
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-primary/5 to-transparent" />
        <div className="pointer-events-none absolute -top-20 -right-20 size-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-10 size-64 rounded-full bg-chart-2/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={cn("gap-1.5 border", STATUS_BG[subscription.status])}
              >
                <span className="size-1.5 rounded-full bg-current" />
                {STATUS_LABELS[subscription.status] ?? subscription.status}
              </Badge>
              <span className="text-xs font-medium text-muted-foreground">
                Depuis le {formatDate(subscription.startDate)}
              </span>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Votre plan
              </p>
              <div className="mt-1 flex items-end gap-3">
                <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
                  {plan.name}
                </h1>
                <span className="mb-1.5 text-lg font-semibold text-muted-foreground">
                  {formatPrice(plan.price, plan.currency)}
                  <span className="text-sm font-normal">
                    /{plan.billingInterval === "annually" ? "an" : "mois"}
                  </span>
                </span>
              </div>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                {plan.description}
              </p>
            </div>
          </div>

          {/* Renouvellement */}
          <div className="flex shrink-0 flex-col gap-3 rounded-2xl border border-border/60 bg-card/80 p-4 backdrop-blur-sm lg:w-64">
            <div className="flex items-center gap-2 text-sm font-medium">
              <CalendarClock className="size-4 text-primary" />
              Prochain renouvellement
            </div>
            <p className="font-display text-lg font-bold">
              {formatDate(periodEnd)}
            </p>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Cycle en cours</span>
                <span
                  className={cn(
                    "font-medium",
                    remainingDays <= 3 ? "text-warning" : ""
                  )}
                >
                  {remainingDays} j restants
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-700"
                  style={{ width: `${cycleProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Usage gauges ── */}
      <section className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <UsageGauge
          icon={FileStack}
          label="Images analysées"
          used={imagesUsed}
          max={imagesMax}
          unit="img"
          delay={0.1}
        />
        {videosMax > 0 ? (
          <UsageGauge
            icon={Video}
            label="Vidéos analysées"
            used={videosUsed}
            max={videosMax}
            unit="vid"
            delay={0.15}
          />
        ) : (
          <QuotaCard
            icon={Video}
            label="Vidéos"
            value="Non incluses"
            delay={0.15}
          />
        )}
        <QuotaCard
          icon={HardDrive}
          label="Rétention historique"
          value={formatRetention(quota.historyRetention)}
          delay={0.2}
        />
      </section>

      {/* ── Quota details + portal ── */}
      <section className="mt-5 grid gap-4 lg:grid-cols-5">
        {/* Quota details */}
        <Card
          className={cn(
            "animate-slide-up overflow-hidden p-0",
            hasPortal ? "lg:col-span-3" : "lg:col-span-5"
          )}
        >
          <div className="border-b px-6 py-4">
            <h2 className="font-display text-base font-bold">Détails du plan</h2>
            <p className="text-xs text-muted-foreground">
              Limites et capacités incluses
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <DetailRow
              icon={HardDrive}
              label="Taille max image"
              value={formatBytes(quota.maxFileSizeImage)}
            />
            {quota.maxFileSizeVideo > 0 && (
              <DetailRow
                icon={Video}
                label="Taille max vidéo"
                value={formatBytes(quota.maxFileSizeVideo)}
              />
            )}
            <DetailRow
              icon={TrendingUp}
              label="Pipeline"
              value={quota.fullPipeline ? "Complet" : "Basique"}
              valueClass={quota.fullPipeline ? "text-success" : ""}
            />
            <DetailRow
              icon={Sparkles}
              label="Modèles de détection"
              value={
                plan.slug === "free" ? "1" : plan.slug === "starter" ? "2" : "4+"
              }
            />
          </div>
        </Card>

        {/* Stripe portal */}
        {hasPortal && (
          <Card className="animate-slide-up flex flex-col justify-between overflow-hidden p-0 lg:col-span-2">
            <div className="relative flex flex-col gap-3 p-6">
              <div className="pointer-events-none absolute top-0 right-0 size-40 rounded-bl-full bg-primary/5" />
              <div className="relative flex size-11 items-center justify-center rounded-xl bg-[#635bff]/10 text-[#635bff]">
                <CreditCard className="size-5" />
              </div>
              <div>
                <h2 className="font-display text-base font-bold">
                  Portail client Stripe
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Gérez votre moyen de paiement, téléchargez vos factures,
                  modifiez ou annulez votre abonnement.
                </p>
              </div>
            </div>
            <div className="border-t p-4">
              <Button
                onClick={handleOpenPortal}
                disabled={portalLoading}
                className="w-full"
              >
                {portalLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <ExternalLink className="size-4" />
                )}
                Ouvrir le portail Stripe
              </Button>
            </div>
          </Card>
        )}
      </section>

      {/* ── Actions ── */}
      <div
        className="animate-fade-in mt-6 flex flex-col gap-3 sm:flex-row"
        style={{ animationDelay: "0.3s" }}
      >
        <Button variant="outline" className="flex-1" onClick={onGoPricing}>
          <RefreshCw className="size-4" />
          Changer de plan
          <ArrowUpRight className="size-3.5 text-muted-foreground" />
        </Button>
        <Button
          variant="ghost"
          className="flex-1 text-muted-foreground"
          onClick={onGoDetect}
        >
          Retour au détecteur
        </Button>
      </div>
    </div>
  )
}

/* ── Circular usage gauge ── */
function UsageGauge({
  icon: Icon,
  label,
  used,
  max,
  unit,
  delay,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  used: number
  max: number
  unit: string
  delay: number
}) {
  const pct = max > 0 ? Math.min(100, (used / max) * 100) : 0
  const isWarning = pct >= 80
  const isCritical = pct >= 95
  const radius = 42
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (pct / 100) * circumference
  const strokeColor = isCritical
    ? "var(--destructive)"
    : isWarning
      ? "#f59e0b"
      : "var(--primary)"

  return (
    <Card
      className="animate-slide-up flex items-center gap-4 p-5"
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Ring */}
      <div className="relative size-24 shrink-0">
        <svg className="size-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="var(--secondary)"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-lg font-bold tabular-nums">
            {Math.round(pct)}%
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Icon className="size-3.5" />
          {label}
        </div>
        <p className="mt-1 font-display text-xl font-bold tabular-nums">
          {formatCount(used)}
          <span className="text-sm font-normal text-muted-foreground">
            {" "}
            / {formatCount(max)} {unit}
          </span>
        </p>
        <p
          className={cn(
            "mt-0.5 text-xs font-medium",
            isCritical
              ? "text-destructive"
              : isWarning
                ? "text-warning"
                : "text-success"
          )}
        >
          {isCritical
            ? "Quota presque atteint"
            : isWarning
              ? "Approche de la limite"
              : `${formatCount(Math.max(0, max - used))} ${unit} restantes`}
        </p>
      </div>
    </Card>
  )
}

/* ── Simple quota card (no progress) ── */
function QuotaCard({
  icon: Icon,
  label,
  value,
  delay,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  delay: number
}) {
  return (
    <Card
      className="animate-slide-up flex items-center gap-4 p-5"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
        <Icon className="size-5" />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-0.5 font-display text-lg font-bold">{value}</p>
      </div>
    </Card>
  )
}

/* ── Detail row ── */
function DetailRow({
  icon: Icon,
  label,
  value,
  valueClass,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  valueClass?: string
}) {
  return (
    <div className="flex items-center justify-between border-b border-border/40 px-6 py-3.5 last:border-b-0">
      <span className="flex items-center gap-2.5 text-sm text-muted-foreground">
        <Icon className="size-4 text-muted-foreground/70" />
        {label}
      </span>
      <span className={cn("text-sm font-semibold", valueClass)}>{value}</span>
    </div>
  )
}

function formatDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function daysUntil(value: string): number {
  const target = new Date(value).getTime()
  if (Number.isNaN(target)) return 0
  const diff = target - Date.now()
  return Math.max(0, Math.ceil(diff / (24 * 60 * 60 * 1000)))
}

function computeCycleProgress(start: string, end: string): number {
  const now = Date.now()
  const startMs = new Date(start).getTime()
  const endMs = new Date(end).getTime()
  const total = endMs - startMs
  if (!Number.isFinite(total) || total <= 0) return 0
  const elapsed = now - startMs
  return Math.min(100, Math.max(0, (elapsed / total) * 100))
}
