import { MediaAction, MediaState } from "./types"

export const mediaReducer = (
  state: MediaState,
  action: MediaAction
): MediaState => {
  switch (action.type) {
    case "GET_PRESIGN_UPLOAD_URL":
      return {
        ...state,
        uploadUrl: action.payload,
        isLoading: false,
        error: null,
      }
    case "GET_PRESIGN_UPLOAD_URL_ERROR":
      return {
        ...state,
        uploadUrl: null,
        isLoading: false,
        error: action.payload,
      }
    case "GET_PRESIGN_UPLOAD_URL_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      }
    default:
      return state
  }
}
