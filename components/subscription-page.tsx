"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
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
  CalendarClock,
  CreditCard,
  ExternalLink,
  ImageIcon,
  Loader2,
  RefreshCw,
  Sparkles,
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
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 py-24">
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
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 py-24 text-center">
        <p className="text-sm text-muted-foreground">
          Aucun abonnement trouvé.
        </p>
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

  return (
    <div className="mx-auto max-w-3xl px-4 pb-20">
      <Card className="animate-slide-up overflow-hidden">
        <div className="relative flex items-center justify-between gap-4 border-b px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="font-display text-xl font-bold">{plan.name}</h2>
                <Badge
                  variant="outline"
                  className={cn("border", STATUS_BG[subscription.status])}
                >
                  {STATUS_LABELS[subscription.status] ?? subscription.status}
                </Badge>
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {plan.description}
              </p>
            </div>
          </div>
          <div className="hidden text-right sm:block">
            <p className="font-display text-2xl font-bold">
              {formatPrice(plan.price, plan.currency)}
            </p>
            <p className="text-xs text-muted-foreground">
              /{plan.billingInterval === "annually" ? "an" : "mois"}
            </p>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-muted-foreground">
                <CalendarClock className="size-3.5" />
                Période de facturation
              </span>
              <span className="font-medium">
                {formatDate(periodStart)} — {formatDate(periodEnd)}
              </span>
            </div>
            <Progress value={cycleProgress} className="h-1.5" />
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Cycle en cours</span>
              <span
                className={cn(
                  "font-medium",
                  remainingDays <= 3 ? "text-warning" : "text-muted-foreground"
                )}
              >
                {remainingDays} jour{remainingDays > 1 ? "s" : ""} restant
                {remainingDays > 1 ? "s" : ""}
              </span>
            </div>
          </div>

          <div className="my-5 h-px bg-border" />

          <div className="space-y-5">
            <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
              Utilisation du mois
            </h3>

            <UsageRow
              icon={ImageIcon}
              label="Images analysées"
              used={imagesUsed}
              max={imagesMax}
            />

            {videosMax > 0 && (
              <UsageRow
                icon={Video}
                label="Vidéos analysées"
                used={videosUsed}
                max={videosMax}
              />
            )}
          </div>

          <div className="my-5 h-px bg-border" />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <QuotaItem
              label="Taille max image"
              value={formatBytes(quota.maxFileSizeImage)}
            />
            {quota.maxFileSizeVideo > 0 && (
              <QuotaItem
                label="Taille max vidéo"
                value={formatBytes(quota.maxFileSizeVideo)}
              />
            )}
            <QuotaItem
              label="Pipeline"
              value={quota.fullPipeline ? "Complet" : "Basique"}
            />
            <QuotaItem
              label="Rétention historique"
              value={formatRetention(quota.historyRetention)}
            />
          </div>
        </CardContent>
      </Card>

      {subscription.stripeCustomerId && (
        <Card
          className="animate-slide-up mt-5 overflow-hidden"
          style={{ animationDelay: "0.1s" }}
        >
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-foreground">
                <CreditCard className="size-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">Portail client Stripe</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Gérez votre carte, téléchargez vos factures, modifiez ou
                  annulez votre abonnement.
                </p>
              </div>
            </div>
            <Button
              onClick={handleOpenPortal}
              disabled={portalLoading}
              className="shrink-0"
            >
              {portalLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ExternalLink className="size-4" />
              )}
              Ouvrir le portail
            </Button>
          </CardContent>
        </Card>
      )}

      <div
        className="animate-fade-in mt-6 flex flex-col gap-3 sm:flex-row"
        style={{ animationDelay: "0.2s" }}
      >
        <Button variant="outline" className="flex-1" onClick={onGoPricing}>
          <RefreshCw className="size-4" />
          Changer de plan
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

function UsageRow({
  icon: Icon,
  label,
  used,
  max,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  used: number
  max: number
}) {
  const pct = max > 0 ? Math.min(100, (used / max) * 100) : 0
  const isWarning = pct >= 80
  const isCritical = pct >= 95

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 text-muted-foreground">
          <Icon className="size-3.5" />
          {label}
        </span>
        <span
          className={cn(
            "font-medium tabular-nums",
            isCritical
              ? "text-destructive"
              : isWarning
                ? "text-warning"
                : "text-foreground"
          )}
        >
          {formatCount(used)} / {formatCount(max)}
        </span>
      </div>
      <Progress
        value={pct}
        className={cn(
          "h-2",
          isCritical && "[&>div]:bg-destructive",
          isWarning && !isCritical && "[&>div]:bg-warning"
        )}
      />
    </div>
  )
}

function QuotaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/60 bg-secondary/30 px-4 py-2.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
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
