"use client"

import { useMedia } from "@/lib/media/context"
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
  const fetchMediasRef = useRef(fetchMedias)
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  )

  fetchMediasRef.current = fetchMedias

  const debouncedRefreshMedias = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    debounceTimeoutRef.current = setTimeout(() => {
      fetchMediasRef.current()
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

      debouncedRefreshMedias()
    },
    [debouncedRefreshMedias]
  )

  const userId = !isLoading ? user?.id : undefined

  useCentrifuge(userId, handlePublication)

  return null
}
