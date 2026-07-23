"use client"

import { Pricing } from "@/components/pricing"
import { useRouter } from "next/navigation"

export default function PricingPage() {
  const router = useRouter()
  return <Pricing onBack={() => router.back()} />
}
