"use client"

import { PaymentSuccess } from "@/components/payment-success"
import { useRouter } from "next/navigation"

export default function SubscriptionSuccessPage() {
  const router = useRouter()

  return (
    <PaymentSuccess
      onGoDetect={() => router.push("/")}
      onGoPricing={() => router.push("/pricing")}
    />
  )
}
