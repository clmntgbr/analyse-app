export interface Media {
  id: string
  filename?: string
  contentType?: string
  url?: string
  createdAt?: string
}

export interface PresignUploadInput {
  Filename: string
  ContentType: string
}

export interface PresignedUploadUrlResponse {
  uploadUrl: string
}

export interface MediaState {
  medias: Media[]
  isMediasLoading: boolean
  mediasError: string | null
  uploadUrl: string | null
  isUploadLoading: boolean
  uploadError: string | null
  uploadProgress: number | null
  isUploaded: boolean
}

export type MediaAction =
  | { type: "GET_MEDIAS"; payload: Media[] }
  | { type: "GET_MEDIAS_ERROR"; payload: string }
  | { type: "GET_MEDIAS_LOADING"; payload: boolean }
  | { type: "UPLOAD_START" }
  | { type: "UPLOAD_PRESIGN_SUCCESS"; payload: string }
  | { type: "UPLOAD_PROGRESS"; payload: number }
  | { type: "UPLOAD_SUCCESS" }
  | { type: "UPLOAD_ERROR"; payload: string }
  | { type: "UPLOAD_LOADING"; payload: boolean }
