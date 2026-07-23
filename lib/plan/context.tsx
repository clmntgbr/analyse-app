"use client"

import { createContext, useContext } from "react"
import { PlanState } from "./types"

export interface PlanContextType extends PlanState {
  fetchPlans: () => Promise<void>
}

export const PlanContext = createContext<PlanContextType | undefined>(undefined)

export const usePlan = () => {
  const context = useContext(PlanContext)
  if (!context) {
    throw new Error("usePlan must be used within PlanProvider")
  }
  return context
}
