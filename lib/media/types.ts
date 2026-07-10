export interface PresignUploadInput {
  Filename: string
  ContentType: string
}

export interface PresignedUploadUrlResponse {
  uploadUrl: string
}

export interface MediaState {
  uploadUrl: string | null
  isLoading: boolean
  error: string | null
  uploadProgress: number | null
  isUploaded: boolean
}

export type MediaAction =
  | { type: "UPLOAD_START" }
  | { type: "UPLOAD_PRESIGN_SUCCESS"; payload: string }
  | { type: "UPLOAD_PROGRESS"; payload: number }
  | { type: "UPLOAD_SUCCESS" }
  | { type: "UPLOAD_ERROR"; payload: string }
  | { type: "UPLOAD_LOADING"; payload: boolean }
