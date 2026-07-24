"use client"

import { SubscriptionPage } from "@/components/subscription-page"
import { useRouter } from "next/navigation"

export default function Page() {
  const router = useRouter()

  return (
    <SubscriptionPage
      onGoPricing={() => router.push("/pricing")}
      onGoDetect={() => router.push("/")}
    />
  )
}
