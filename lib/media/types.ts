export interface PresignUploadInput {
  Filename: string
  ContentType: string
}

export interface PresignedUploadUrlResponse {
  upload_url: string
}

export interface MediaState {
  uploadUrl: string | null
  isLoading: boolean
  error: string | null
}

export type MediaAction =
  | { type: "GET_PRESIGN_UPLOAD_URL"; payload: string }
  | { type: "GET_PRESIGN_UPLOAD_URL_ERROR"; payload: string }
  | { type: "GET_PRESIGN_UPLOAD_URL_LOADING"; payload: boolean }
