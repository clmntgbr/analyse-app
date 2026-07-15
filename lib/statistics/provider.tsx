"use client"

import { useCallback, useEffect, useReducer } from "react"
import { getStatistics } from "./api"
import { StatisticsContext } from "./context"
import { statisticsReducer } from "./reducer"
import { StatisticsState } from "./types"

const initialState: StatisticsState = {
  statistics: null,
  isLoading: false,
  error: null,
}

export function StatisticsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [state, dispatch] = useReducer(statisticsReducer, initialState)

  const fetchStatistics = useCallback(async () => {
    try {
      dispatch({ type: "GET_STATISTICS_LOADING", payload: true })
      const statistics = await getStatistics()
      dispatch({ type: "GET_STATISTICS", payload: statistics })
    } catch {
      dispatch({
        type: "GET_STATISTICS_ERROR",
        payload: "Failed to fetch statistics",
      })
    } finally {
      dispatch({ type: "GET_STATISTICS_LOADING", payload: false })
    }
  }, [])

  useEffect(() => {
    fetchStatistics()
  }, [fetchStatistics])

  return (
    <StatisticsContext.Provider
      value={{
        ...state,
        fetchStatistics,
      }}
    >
      {children}
    </StatisticsContext.Provider>
  )
}
