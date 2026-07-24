"use client"

import { PaymentCancel } from "@/components/payment-cancel"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"

function SubscriptionCancelContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const reason =
    searchParams.get("reason") === "declined" ? "declined" : "cancelled"

  return (
    <PaymentCancel reason={reason} onGoDetect={() => router.push("/")} />
  )
}

export default function SubscriptionCancelPage() {
  return (
    <Suspense>
      <SubscriptionCancelContent />
    </Suspense>
  )
}
