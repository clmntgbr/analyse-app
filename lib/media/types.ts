import { Paginate } from "../paginate"

export interface Media {
  id: string
  key: string
  size: number
  contentType: string
  thumbnail: string
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
