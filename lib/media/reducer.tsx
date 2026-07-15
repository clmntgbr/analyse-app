import { MediaAction, MediaState } from "./types"

export const mediaReducer = (
  state: MediaState,
  action: MediaAction
): MediaState => {
  switch (action.type) {
    case "GET_MEDIAS":
      return {
        ...state,
        medias: action.payload,
        isMediasLoading: false,
        mediasError: null,
      }
    case "GET_MEDIAS_ERROR":
      return {
        ...state,
        isMediasLoading: false,
        mediasError: action.payload,
      }
    case "GET_MEDIAS_LOADING":
      return {
        ...state,
        isMediasLoading: action.payload,
      }
    default:
      return state
  }
}
