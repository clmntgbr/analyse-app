import {
  AnalysisConfidence,
  AnalysisVerdict,
  Signal,
} from "@/lib/analysis/types"

export interface AnalysisStartedEvent {
  type: "analysis_started"
  analysisId: string
  userId: string
  status: string
  updatedAt: string
}

export interface AnalysisCompletedEvent {
  type: "analysis_completed"
  analysisId: string
  finalScore: number
  confidence: AnalysisConfidence
  verdict: AnalysisVerdict
  signals?: Signal[]
}

export type AnalysisStreamEvent = AnalysisStartedEvent | AnalysisCompletedEvent

export function isAnalysisStreamEvent(
  value: unknown
): value is AnalysisStreamEvent {
  if (!value || typeof value !== "object") return false

  const type = (value as { type?: string }).type

  return type === "analysis_started" || type === "analysis_completed"
}

export function shouldRefetchAnalyses(
  event: AnalysisStreamEvent
): event is AnalysisCompletedEvent {
  return event.type === "analysis_completed"
}

export function getUserChannel(userId: string): string {
  return `users:${userId}`
}
