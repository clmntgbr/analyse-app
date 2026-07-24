"use client"

import { createContext, useContext } from "react"
import {
  CreateSubscriptionResponse,
  SubscriptionState,
} from "./types"

export interface SubscriptionContextType extends SubscriptionState {
  fetchSubscription: () => Promise<void>
  createSubscription: (
    planId: string
  ) => Promise<CreateSubscriptionResponse | null>
  markPaymentSucceeded: () => void
  resetPaymentSucceeded: () => void
}

export const SubscriptionContext = createContext<
  SubscriptionContextType | undefined
>(undefined)

export const useSubscription = () => {
  const context = useContext(SubscriptionContext)
  if (!context) {
    throw new Error("useSubscription must be used within SubscriptionProvider")
  }
  return context
}
