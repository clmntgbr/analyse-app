"use client"

import { createContext, useContext } from "react"
import { StatisticsState } from "./types"

export interface StatisticsContextType extends StatisticsState {
  fetchStatistics: () => Promise<void>
}

export const StatisticsContext = createContext<
  StatisticsContextType | undefined
>(undefined)

export const useStatistics = () => {
  const context = useContext(StatisticsContext)
  if (!context) {
    throw new Error("useStatistics must be used within StatisticsProvider")
  }
  return context
}
