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
        medias: [],
        isMediasLoading: false,
        mediasError: action.payload,
      }
    case "GET_MEDIAS_LOADING":
      return {
        ...state,
        isMediasLoading: action.payload,
      }
    case "UPLOAD_START":
      return {
        ...state,
        uploadUrl: null,
        uploadError: null,
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
        isUploadLoading: false,
        uploadError: null,
      }
    case "UPLOAD_ERROR":
      return {
        ...state,
        isUploadLoading: false,
        uploadError: action.payload,
      }
    case "UPLOAD_LOADING":
      return {
        ...state,
        isUploadLoading: action.payload,
      }
    default:
      return state
  }
}
