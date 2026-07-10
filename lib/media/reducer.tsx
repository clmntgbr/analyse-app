import { MediaAction, MediaState } from "./types"

export const mediaReducer = (
  state: MediaState,
  action: MediaAction
): MediaState => {
  switch (action.type) {
    case "UPLOAD_START":
      return {
        ...state,
        uploadUrl: null,
        error: null,
        uploadProgress: 0,
        isUploaded: false,
      }
    case "UPLOAD_PRESIGN_SUCCESS":
      return {
        ...state,
        uploadUrl: action.payload,
      }
    case "UPLOAD_PROGRESS":
      return {
        ...state,
        uploadProgress: action.payload,
      }
    case "UPLOAD_SUCCESS":
      return {
        ...state,
        uploadProgress: 100,
        isUploaded: true,
        isLoading: false,
        error: null,
      }
    case "UPLOAD_ERROR":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      }
    case "UPLOAD_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      }
    default:
      return state
  }
}
