import { Paginate } from "../paginate"

export type MediaVerdict = "likely_ai" | "likely_real" | "uncertain"
export type MediaConfidence = "low" | "medium" | "high" | "unknown"
export type MediaStatus = "pending" | "processing" | "analyzed" | "error"

export interface Media {
  id: string
  key: string
  thumbnail: string
  size?: number
  status: MediaStatus
  finalScore?: number
  confidence?: MediaConfidence
  verdict?: MediaVerdict
  signals?: Signal[]
  createdAt: string
  updatedAt: string
}

export interface Signal {
  id: string
  mediaId: string
  name: string
  score: number
  confidence: MediaConfidence
  details: string[]
  createdAt: string
  updatedAt: string
}

export interface PresignUploadInput {
  Filename: string
  ContentType: string
}

export interface GeneratePresignedUploadUrlDetailResponse {
  uploadUrl: string
}

export interface MediaState {
  medias: Paginate<Media>
  isMediasLoading: boolean
  mediasError: string | null
}

export type MediaAction =
  | { type: "GET_MEDIAS"; payload: Paginate<Media> }
  | { type: "GET_MEDIAS_ERROR"; payload: string }
  | { type: "GET_MEDIAS_LOADING"; payload: boolean }
