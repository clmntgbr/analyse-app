"use client"

import { useAnalysis } from "@/lib/analysis/context"
import { useStatistics } from "@/lib/statistics/context"
import { useUser } from "@/lib/user/context"
import { useCallback, useEffect, useRef } from "react"
import { isAnalysisStreamEvent, shouldRefetchAnalyses } from "./types"
import { useCentrifuge } from "./use-centrifuge"

const REFRESH_DEBOUNCE_MS = 500

export function AnalysisCentrifugeListener() {
  const { user, isLoading } = useUser()
  const { fetchAnalyses } = useAnalysis()
  const { fetchStatistics } = useStatistics()
  const fetchAnalysesRef = useRef(fetchAnalyses)
  const fetchStatisticsRef = useRef(fetchStatistics)
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  )

  fetchAnalysesRef.current = fetchAnalyses
  fetchStatisticsRef.current = fetchStatistics

  const debouncedRefresh = useCallback(() => {
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

  const handlePublication = useCallback(
    (data: unknown) => {
      if (!isAnalysisStreamEvent(data)) {
        console.warn("[Centrifugo] ignored publication", data)
        return
      }

      console.log(data.type, data)

      if (!shouldRefetchAnalyses(data)) return

      debouncedRefresh()
    },
    [debouncedRefresh]
  )

  const userId = !isLoading ? user?.id : undefined

  useCentrifuge(userId, handlePublication)

  return null
}
