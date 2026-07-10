"use client"

import { useCallback, useEffect, useReducer } from "react"
import { initPaginate } from "../paginate"
import {
  generatePresignedUploadUrl,
  getMedias,
  uploadFileToPresignedUrl,
} from "./api"
import { MediaContext } from "./context"
import { mediaReducer } from "./reducer"
import { Media, MediaState } from "./types"

const initialState: MediaState = {
  medias: initPaginate<Media>(),
}

export function MediaProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(mediaReducer, initialState)

  const fetchMedias = useCallback(async () => {
    try {
      dispatch({ type: "GET_MEDIAS_LOADING", payload: true })
      const medias = await getMedias()
      dispatch({ type: "GET_MEDIAS", payload: medias })
    } catch {
      dispatch({ type: "GET_MEDIAS_ERROR", payload: "Failed to fetch medias" })
    } finally {
      dispatch({ type: "GET_MEDIAS_LOADING", payload: false })
    }
  }, [])

  const uploadFile = useCallback(
    async (file: File) => {
      const contentType = file.type || "application/octet-stream"

      try {
        const { uploadUrl } = await generatePresignedUploadUrl({
          Filename: file.name,
          ContentType: contentType,
        })

        await uploadFileToPresignedUrl(file, uploadUrl, (progress) => {
          console.log(progress)
        })

        await fetchMedias()
      } catch {
        console.error("Failed to upload file")
      }
    },
    [fetchMedias]
  )

  useEffect(() => {
    fetchMedias()
  }, [fetchMedias])

  return (
    <MediaContext.Provider
      value={{
        ...state,
        fetchMedias,
        uploadFile,
      }}
    >
      {children}
    </MediaContext.Provider>
  )
}
