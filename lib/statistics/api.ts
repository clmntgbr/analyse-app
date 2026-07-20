import { AnalysisStatistics } from "./types"

export const getStatistics = async (): Promise<AnalysisStatistics> => {
  const response = await fetch("/api/analyses/statistics", {
    method: "GET",
  })

  if (!response.ok) {
    throw new Error("Failed to fetch statistics")
  }

  return response.json()
}
