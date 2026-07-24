"use client"

import { Pricing } from "@/components/pricing"
import { useSubscription } from "@/lib/subscription/context"
import { useRouter } from "next/navigation"

export default function PricingPage() {
  const router = useRouter()
  const { subscription } = useSubscription()

  const currentPlanSlug =
    subscription?.effectivePlan?.slug ?? subscription?.plan?.slug ?? null

  return (
    <Pricing
      onBack={() => router.back()}
      currentPlanSlug={currentPlanSlug}
    />
  )
}
