"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatPrice } from "@/lib/plan/pricing"
import { useSubscription } from "@/lib/subscription/context"
import { cn } from "@/lib/utils"
import {
  Check,
  Home,
  Loader2,
  PartyPopper,
  Receipt,
  ShieldCheck,
  Sparkles,
} from "lucide-react"
import { useEffect } from "react"

const REDIRECT_DELAY_MS = 5000

interface PaymentSuccessProps {
  onGoDetect: () => void
  onGoPricing: () => void
}

export function PaymentSuccess({
  onGoDetect,
  onGoPricing,
}: PaymentSuccessProps) {
  const {
    subscription,
    paymentSucceeded,
    fetchSubscription,
    resetPaymentSucceeded,
  } = useSubscription()

  const verifying = !paymentSucceeded
  const plan = subscription?.plan ?? undefined
  const interval =
    plan?.billingInterval === "annually" ? "annually" : "monthly"

  useEffect(() => {
    void fetchSubscription()
  }, [fetchSubscription])

  // Redirect to the detector after a short delay: the subscription will be
  // reconciled globally there, avoiding a stuck state if the Centrifugo
  // "payment_succeeded" event was missed during the Stripe redirect.
  useEffect(() => {
    const timeout = setTimeout(onGoDetect, REDIRECT_DELAY_MS)
    return () => clearTimeout(timeout)
  }, [onGoDetect])

  useEffect(() => {
    return () => {
      resetPaymentSucceeded()
    }
  }, [resetPaymentSucceeded])

  return (
    <div className="container mx-auto max-w-lg px-4 pb-20">
      <section className="relative flex flex-col items-center gap-4 py-12 text-center sm:py-16">
        <div className="bg-grid mask-fade-b pointer-events-none absolute inset-0 -z-10 opacity-40" />
        <div
          className="pointer-events-none absolute top-0 left-1/2 -z-10 size-[400px] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, var(--primary), transparent 70%)",
          }}
        />

        <div className="relative animate-in zoom-in-95 duration-300">
          <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
          <div className="relative flex size-20 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30">
            {verifying ? (
              <Loader2 className="size-9 animate-spin" />
            ) : (
              <Check className="size-9" strokeWidth={3} />
            )}
          </div>
        </div>

        <div
          className="animate-slide-up space-y-2"
          style={{ animationDelay: "0.15s" }}
        >
          <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {verifying ? "Vérification du paiement…" : "Paiement réussi !"}
          </h1>
          <p className="text-balance text-muted-foreground">
            {verifying
              ? "Nous confirmons votre transaction. Vous pouvez quitter cette page, votre abonnement sera activé automatiquement."
              : plan
                ? `Votre abonnement ${plan.name} est maintenant actif. Bienvenue.`
                : "Votre abonnement est maintenant actif. Bienvenue."}
          </p>
          <p className="text-xs text-muted-foreground">
            Redirection automatique dans quelques secondes…
          </p>
        </div>
      </section>

      {!verifying && (
        <Card
          className="animate-slide-up overflow-hidden ring-border/10"
          style={{ animationDelay: "0.25s" }}
        >
          <div className="flex items-center gap-3 border-b bg-primary/5 px-5 py-4">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <PartyPopper className="size-4.5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Confirmation de commande</p>
              <p className="text-xs text-muted-foreground">
                {subscription?.id
                  ? `Abonnement #${subscription.id.slice(0, 8).toUpperCase()}`
                  : "Abonnement confirmé"}
              </p>
            </div>
          </div>

          <CardContent className="p-5">
            {plan && (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-4 text-primary" />
                    <span className="text-sm font-medium">Plan {plan.name}</span>
                  </div>
                  <span className="text-sm font-semibold">
                    {formatPrice(plan.price, plan.currency)}
                    <span className="text-muted-foreground">
                      /{interval === "annually" ? "an" : "mois"}
                    </span>
                  </span>
                </div>
                <div className="my-4 h-px bg-border" />
              </>
            )}

            <ul className="flex flex-col gap-3 text-sm">
              <SummaryRow
                icon={ShieldCheck}
                label="Statut"
                value={subscription?.status ?? "Actif"}
                valueClass="font-semibold text-primary capitalize"
              />
              <SummaryRow
                icon={Receipt}
                label="Prochaine facturation"
                value={
                  subscription?.endDate
                    ? formatBillingDate(subscription.endDate)
                    : nextBillingDate(interval)
                }
              />
            </ul>

            <div className="mt-5 rounded-xl border bg-secondary/50 p-3 text-xs text-muted-foreground">
              Un reçu a été envoyé à votre adresse e-mail. Vous pouvez modifier
              ou annuler votre abonnement à tout moment depuis vos paramètres.
            </div>
          </CardContent>
        </Card>
      )}

      {!verifying && (
        <div
          className="animate-fade-in mt-6 flex flex-col gap-3 sm:flex-row"
          style={{ animationDelay: "0.35s" }}
        >
          <Button className="flex-1" onClick={onGoDetect}>
            <Home className="size-4" />
            Commencer à analyser
          </Button>
          <Button variant="outline" className="flex-1" onClick={onGoPricing}>
            Voir les autres plans
          </Button>
        </div>
      )}

      {verifying && (
        <div className="mt-2 flex justify-center">
          <Button variant="ghost" onClick={onGoDetect} className="text-muted-foreground">
            ← Retour au détecteur
          </Button>
        </div>
      )}
    </div>
  )
}

function SummaryRow({
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
    <li className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-3.5" />
        {label}
      </span>
      <span className={cn("font-medium", valueClass)}>{value}</span>
    </li>
  )
}

function formatBillingDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function nextBillingDate(interval: "monthly" | "annually"): string {
  const now = new Date()
  if (interval === "annually") {
    now.setFullYear(now.getFullYear() + 1)
  } else {
    now.setMonth(now.getMonth() + 1)
  }
  return now.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}
