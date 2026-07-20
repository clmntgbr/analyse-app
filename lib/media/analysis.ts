import type {
  Insight,
  InsightKey,
  MediaConfidence,
  MediaVerdict,
} from "./types"

export type VerdictIcon = "shield-check" | "user" | "help-circle" | "bot"

export interface VerdictConfig {
  short: string
  label: string
  description: string
  icon: VerdictIcon
  bg: string
  color: string
  border: string
}

export const VERDICT_CONFIG: Record<MediaVerdict, VerdictConfig> = {
  likely_ai: {
    short: "IA",
    label: "Probablement IA",
    description:
      "Plusieurs indicateurs suggèrent une génération ou une manipulation par IA.",
    icon: "bot",
    bg: "bg-destructive/10",
    color: "text-destructive",
    border: "border-destructive/20",
  },
  likely_real: {
    short: "Réel",
    label: "Probablement réel",
    description:
      "Les signaux analysés sont cohérents avec un contenu authentique.",
    icon: "shield-check",
    bg: "bg-primary/10",
    color: "text-primary",
    border: "border-primary/20",
  },
  uncertain: {
    short: "Incertain",
    label: "Incertain",
    description:
      "Les résultats sont mitigés ; une vérification humaine reste recommandée.",
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

export interface InsightConfig {
  label: string
  description: string
  help?: string
}

export const INSIGHT_CONFIG: Record<InsightKey, InsightConfig> = {
  noise: {
    label: "Bruit",
    description: "Analyse du bruit résiduel et de sa cohérence spatiale.",
    help: "Le bruit est une composante indésirable de l’image qui peut être causée par le processus de compression ou par des artefacts de quantification. Il peut être utilisé pour évaluer la qualité de l’image et la présence de compression.",
  },
  compression: {
    label: "Compression",
    description: "Traces de compression et artefacts de quantification.",
    help: "La compression est un processus qui réduit la taille d’un fichier image en supprimant des informations inutiles. Elle peut être utilisée pour réduire la taille des fichiers et pour améliorer la qualité de l’image.",
  },
  frequency: {
    label: "Fréquences",
    description: "Répartition des hautes et basses fréquences de l’image.",
    help: "Les hautes fréquences sont des détails fins et les basses fréquences sont des détails grossiers. La fréquence est utilisée pour évaluer la qualité de l’image et la présence de détails.",
  },
  histogram: {
    label: "Histogramme",
    description: "Distribution des intensités et anomalies statistiques.",
    help: "L’histogramme est un graphique qui montre la distribution des intensités de l’image. Il peut être utilisé pour évaluer la qualité de l’image et la présence d’anomalies statistiques.",
  },
}

export const INSIGHT_KEYS = Object.keys(INSIGHT_CONFIG) as InsightKey[]

export function getInsightEntries(insight: Insight): {
  key: InsightKey
  value: number
  label: string
  description: string
  help?: string
}[] {
  return INSIGHT_KEYS.map((key) => ({
    key,
    value: insight[key],
    label: INSIGHT_CONFIG[key].label,
    description: INSIGHT_CONFIG[key].description,
    help: INSIGHT_CONFIG[key].help,
  }))
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
