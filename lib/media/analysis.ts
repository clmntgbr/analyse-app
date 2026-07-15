import type { MediaConfidence, MediaVerdict } from "./types"

export type VerdictIcon = "shield-check" | "user" | "help-circle" | "bot"

export interface VerdictConfig {
  short: string
  label: string
  icon: VerdictIcon
  bg: string
  color: string
  border: string
}

export const VERDICT_CONFIG: Record<MediaVerdict, VerdictConfig> = {
  likely_ai: {
    short: "IA",
    label: "Probablement IA",
    icon: "bot",
    bg: "bg-destructive/10",
    color: "text-destructive",
    border: "border-destructive/20",
  },
  likely_real: {
    short: "Réel",
    label: "Probablement réel",
    icon: "shield-check",
    bg: "bg-primary/10",
    color: "text-primary",
    border: "border-primary/20",
  },
  uncertain: {
    short: "Incertain",
    label: "Incertain",
    icon: "help-circle",
    bg: "bg-muted",
    color: "text-muted-foreground",
    border: "border-border",
  },
}

export const VERDICT_COLOR_VAR: Record<MediaVerdict, string> = {
  likely_real: "--primary",
  uncertain: "--chart-3",
  likely_ai: "--destructive",
}

export const CONFIDENCE_LABEL: Record<MediaConfidence, string> = {
  low: "faible",
  medium: "moyenne",
  high: "élevée",
  unknown: "inconnue",
}

export function getMediaProgress(
  status: "pending" | "processing" | "analyzed" | "error"
): number {
  if (status === "processing") return 66
  if (status === "pending") return 33
  return 100
}

function isVideoKey(key: string): boolean {
  return /\.(mp4|mov|webm)$/i.test(key)
}

export function isVideoMedia(key: string): boolean {
  return isVideoKey(key)
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
}
