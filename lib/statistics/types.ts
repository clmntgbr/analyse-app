export interface MediaStatistics {
  analysesCount: number
  realImageCount: number
  aiImageCount: number
  averageScore: number
}

export interface StatisticsState {
  statistics: MediaStatistics | null
  isLoading: boolean
  error: string | null
}

export type StatisticsAction =
  | { type: "GET_STATISTICS"; payload: MediaStatistics }
  | { type: "GET_STATISTICS_ERROR"; payload: string }
  | { type: "GET_STATISTICS_LOADING"; payload: boolean }
