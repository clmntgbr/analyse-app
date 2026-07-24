"use client"

import { useCallback, useEffect, useReducer } from "react"
import {
  createSubscription as createSubscriptionRequest,
  getSubscription,
} from "./api"
import { SubscriptionContext } from "./context"
import { subscriptionReducer } from "./reducer"
import { CreateSubscriptionResponse, SubscriptionState } from "./types"

const initialState: SubscriptionState = {
  subscription: null,
  isLoading: false,
  isCreating: false,
  error: null,
}

export function SubscriptionProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [state, dispatch] = useReducer(subscriptionReducer, initialState)

  const fetchSubscription = useCallback(async () => {
    try {
      dispatch({ type: "GET_SUBSCRIPTION_LOADING", payload: true })
      const subscription = await getSubscription()
      dispatch({ type: "GET_SUBSCRIPTION", payload: subscription })
    } catch {
      dispatch({
        type: "GET_SUBSCRIPTION_ERROR",
        payload: "Failed to fetch subscription",
      })
    } finally {
      dispatch({ type: "GET_SUBSCRIPTION_LOADING", payload: false })
    }
  }, [])

  const createSubscription = useCallback(
    async (planId: string): Promise<CreateSubscriptionResponse | null> => {
      try {
        dispatch({ type: "CREATE_SUBSCRIPTION_LOADING", payload: true })
        const result = await createSubscriptionRequest({ planId })
        dispatch({ type: "CREATE_SUBSCRIPTION_SUCCESS" })
        return result
      } catch {
        dispatch({
          type: "CREATE_SUBSCRIPTION_ERROR",
          payload: "Failed to create subscription",
        })
        return null
      }
    },
    []
  )

  useEffect(() => {
    fetchSubscription()
  }, [fetchSubscription])

  return (
    <SubscriptionContext.Provider
      value={{
        ...state,
        fetchSubscription,
        createSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  )
}
