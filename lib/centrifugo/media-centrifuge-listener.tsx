"use client"

import { useMedia } from "@/lib/media/context"
import { useStatistics } from "@/lib/statistics/context"
import { useUser } from "@/lib/user/context"
import { useCallback, useEffect, useRef } from "react"
import {
  isMediaStreamEvent,
  shouldRefetchMedias,
} from "./types"
import { useCentrifuge } from "./use-centrifuge"

const REFRESH_DEBOUNCE_MS = 500

export function MediaCentrifugeListener() {
  const { user, isLoading } = useUser()
  const { fetchMedias } = useMedia()
  const { fetchStatistics } = useStatistics()
  const fetchMediasRef = useRef(fetchMedias)
  const fetchStatisticsRef = useRef(fetchStatistics)
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  )

  fetchMediasRef.current = fetchMedias
  fetchStatisticsRef.current = fetchStatistics

  const debouncedRefresh = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    debounceTimeoutRef.current = setTimeout(() => {
      void fetchMediasRef.current()
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
      if (!isMediaStreamEvent(data)) {
        console.warn("[Centrifugo] ignored publication", data)
        return
      }

      console.log(data.type, data)

      if (!shouldRefetchMedias(data)) return

      debouncedRefresh()
    },
    [debouncedRefresh]
  )

  const userId = !isLoading ? user?.id : undefined

  useCentrifuge(userId, handlePublication)

  return null
}
