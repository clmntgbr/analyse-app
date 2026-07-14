"use client"

import { Centrifuge } from "centrifuge"
import { useEffect, useRef } from "react"
import { getCentrifugoToken } from "./api"
import { getUserChannel } from "./types"

function getCentrifugoUrl(): string {
  const url = process.env.NEXT_PUBLIC_CENTRIFUGO_URL

  if (!url) {
    throw new Error("Missing NEXT_PUBLIC_CENTRIFUGO_URL")
  }

  return url
}

export function useCentrifuge(
  userId: string | undefined,
  onPublication: (data: unknown) => void
) {
  const onPublicationRef = useRef(onPublication)

  onPublicationRef.current = onPublication

  useEffect(() => {
    if (!userId) return

    let centrifuge: Centrifuge | null = null

    try {
      centrifuge = new Centrifuge(getCentrifugoUrl(), {
        getToken: getCentrifugoToken,
      })

      const channel = getUserChannel(userId)
      const subscription = centrifuge.newSubscription(channel)

      subscription.on("publication", (ctx) => {
        console.log("[Centrifugo] publication", channel, ctx.data)
        onPublicationRef.current(ctx.data)
      })

      subscription.on("subscribed", () => {
        console.log("[Centrifugo] subscribed", channel)
      })

      subscription.on("error", (ctx) => {
        console.error("[Centrifugo] subscription error", channel, ctx)
      })

      centrifuge.on("connected", () => {
        console.log("[Centrifugo] connected")
      })

      centrifuge.on("disconnected", (ctx) => {
        console.warn("[Centrifugo] disconnected", ctx)
      })

      subscription.subscribe()
      centrifuge.connect()
    } catch (error) {
      console.error("[Centrifugo] setup error", error)
    }

    return () => {
      centrifuge?.disconnect()
    }
  }, [userId])
}
