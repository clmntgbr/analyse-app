import { StatisticsAction, StatisticsState } from "./types"

export const statisticsReducer = (
  state: StatisticsState,
  action: StatisticsAction
): StatisticsState => {
  switch (action.type) {
    case "GET_STATISTICS":
      return {
        ...state,
        statistics: action.payload,
        isLoading: false,
        error: null,
      }
    case "GET_STATISTICS_ERROR":
      return {
        ...state,
        statistics: null,
        isLoading: false,
        error: action.payload,
      }
    case "GET_STATISTICS_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      }
    default:
      return state
  }
}
