import { AnalysisAction, AnalysisState } from "./types"

export const analysisReducer = (
  state: AnalysisState,
  action: AnalysisAction
): AnalysisState => {
  switch (action.type) {
    case "GET_ANALYSES":
      return {
        ...state,
        analyses: action.payload,
        isAnalysesLoading: false,
        analysesError: null,
      }
    case "GET_ANALYSES_ERROR":
      return {
        ...state,
        isAnalysesLoading: false,
        analysesError: action.payload,
      }
    case "GET_ANALYSES_LOADING":
      return {
        ...state,
        isAnalysesLoading: action.payload,
      }
    default:
      return state
  }
}
