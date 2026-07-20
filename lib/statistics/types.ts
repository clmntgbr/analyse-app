export interface AnalysisStatistics {
  analysesCount: number
  realImageCount: number
  aiImageCount: number
  averageScore: number
}

export interface StatisticsState {
  statistics: AnalysisStatistics | null
  isLoading: boolean
  error: string | null
}

export type StatisticsAction =
  | { type: "GET_STATISTICS"; payload: AnalysisStatistics }
  | { type: "GET_STATISTICS_ERROR"; payload: string }
  | { type: "GET_STATISTICS_LOADING"; payload: boolean }
