import { MediaConfidence, MediaVerdict } from "@/lib/media/types"

export interface AnalysisStartedEvent {
  type: "analysis_started"
  mediaId: string
  userId: string
  status: string
  updatedAt: string
}

export interface AnalysisCompletedEvent {
  type: "analysis_completed"
  mediaId: string
  finalScore: number
  confidence: MediaConfidence
  verdict: MediaVerdict
  signals: unknown[]
}

export type MediaStreamEvent = AnalysisStartedEvent | AnalysisCompletedEvent

export function isMediaStreamEvent(value: unknown): value is MediaStreamEvent {
  if (!value || typeof value !== "object") return false

  const type = (value as { type?: string }).type

  return type === "analysis_started" || type === "analysis_completed"
}

export function shouldRefetchMedias(
  event: MediaStreamEvent
): event is AnalysisCompletedEvent {
  return event.type === "analysis_completed"
}

export function getUserChannel(userId: string): string {
  return `users:${userId}`
}
