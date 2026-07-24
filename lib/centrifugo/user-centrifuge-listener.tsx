"use client"

import { useAnalysis } from "@/lib/analysis/context"
import { useStatistics } from "@/lib/statistics/context"
import { useSubscription } from "@/lib/subscription/context"
import { useUser } from "@/lib/user/context"
import { useCallback, useEffect, useRef } from "react"
import { isUserStreamEvent, shouldRefetchAnalyses } from "./types"
import { useCentrifuge } from "./use-centrifuge"

const REFRESH_DEBOUNCE_MS = 500

export function UserCentrifugeListener() {
  const { user, isLoading } = useUser()
  const { fetchAnalyses } = useAnalysis()
  const { fetchStatistics } = useStatistics()
  const { fetchSubscription, markPaymentSucceeded } = useSubscription()

  const fetchAnalysesRef = useRef(fetchAnalyses)
  const fetchStatisticsRef = useRef(fetchStatistics)
  const fetchSubscriptionRef = useRef(fetchSubscription)
  const markPaymentSucceededRef = useRef(markPaymentSucceeded)
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  )

  useEffect(() => {
    fetchAnalysesRef.current = fetchAnalyses
    fetchStatisticsRef.current = fetchStatistics
    fetchSubscriptionRef.current = fetchSubscription
    markPaymentSucceededRef.current = markPaymentSucceeded
  }, [
    fetchAnalyses,
    fetchStatistics,
    fetchSubscription,
    markPaymentSucceeded,
  ])

  const debouncedRefreshAnalyses = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    debounceTimeoutRef.current = setTimeout(() => {
      void fetchAnalysesRef.current()
      void fetchStatisticsRef.current()
    }, REFRESH_DEBOUNCE_MS)
  }, [])

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [])

  const handlePublication = useCallback((data: unknown) => {
    if (!isUserStreamEvent(data)) {
      console.warn("[Centrifugo] ignored publication", data)
      return
    }

    console.log(data.type, data)

    if (shouldRefetchAnalyses(data)) {
      debouncedRefreshAnalyses()
      return
    }

    if (data.type === "subscription_updated") {
      void fetchSubscriptionRef.current()
      return
    }

    if (data.type === "payment_succeeded") {
      void fetchSubscriptionRef.current()
      markPaymentSucceededRef.current()
    }
  }, [debouncedRefreshAnalyses])

  const userId = !isLoading ? user?.id : undefined

  useCentrifuge(userId, handlePublication)

  return null
}
