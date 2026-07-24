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

export interface SubscriptionUpdatedEvent {
  type: "subscription_updated"
  userId?: string
}

export interface PaymentSucceededEvent {
  type: "payment_succeeded"
  userId?: string
}

export interface PaymentFailedEvent {
  type: "payment_failed"
  userId?: string
}

export type UserStreamEvent =
  | AnalysisStartedEvent
  | AnalysisCompletedEvent
  | SubscriptionUpdatedEvent
  | PaymentSucceededEvent
  | PaymentFailedEvent

export function isUserStreamEvent(value: unknown): value is UserStreamEvent {
  if (!value || typeof value !== "object") return false

  const type = (value as { type?: string }).type

  return (
    type === "analysis_started" ||
    type === "analysis_completed" ||
    type === "subscription_updated" ||
    type === "payment_succeeded" ||
    type === "payment_failed"
  )
}

export function shouldRefetchAnalyses(
  event: UserStreamEvent
): event is AnalysisCompletedEvent {
  return event.type === "analysis_completed"
}

export function getUserChannel(userId: string): string {
  return `users:${userId}`
}
