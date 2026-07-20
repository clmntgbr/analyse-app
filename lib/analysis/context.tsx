"use client"

import { createContext, useContext } from "react"
import { Analysis, AnalysisState } from "./types"

export interface AnalysisContextType extends AnalysisState {
  fetchAnalyses: () => Promise<void>
  fetchAnalysis: (id: string) => Promise<Analysis>
  uploadFile: (file: File) => Promise<void>
}

export const AnalysisContext = createContext<AnalysisContextType | undefined>(
  undefined
)

export const useAnalysis = () => {
  const context = useContext(AnalysisContext)
  if (!context) {
    throw new Error("useAnalysis must be used within AnalysisProvider")
  }
  return context
}
