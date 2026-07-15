"use client"

import { createContext, useContext } from "react"
import { Media, MediaState } from "./types"

export interface MediaContextType extends MediaState {
  fetchMedias: () => Promise<void>
  fetchMedia: (id: string) => Promise<Media>
  uploadFile: (file: File) => Promise<void>
}

export const MediaContext = createContext<MediaContextType | undefined>(
  undefined
)

export const useMedia = () => {
  const context = useContext(MediaContext)
  if (!context) {
    throw new Error("useMedia must be used within MediaProvider")
  }
  return context
}
