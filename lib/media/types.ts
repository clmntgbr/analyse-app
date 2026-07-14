import { Paginate } from "../paginate"

export type MediaVerdict = "likely_ai" | "likely_real" | "uncertain"
export type MediaConfidence = "low" | "medium" | "high"
export type MediaStatus = "pending" | "processing" | "analyzed" | "error"

export interface Media {
  id: string
  key: string
  thumbnail: string
  status: MediaStatus
  finalScore?: number
  confidence?: MediaConfidence
  verdict?: MediaVerdict
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
}

export type MediaAction =
  | { type: "GET_MEDIAS"; payload: Paginate<Media> }
  | { type: "GET_MEDIAS_ERROR"; payload: string }
  | { type: "GET_MEDIAS_LOADING"; payload: boolean }
