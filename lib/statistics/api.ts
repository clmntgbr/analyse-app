import { MediaStatistics } from "./types"

export const getStatistics = async (): Promise<MediaStatistics> => {
  const response = await fetch("/api/statistics", {
    method: "GET",
  })

  if (!response.ok) {
    throw new Error("Failed to fetch statistics")
  }

  return response.json()
}
