"use client"

import { useCallback, useEffect, useReducer } from "react"
import {
  generatePresignedUploadUrl,
  getMedias,
  uploadFileToPresignedUrl,
} from "./api"
import { MediaContext } from "./context"
import { mediaReducer } from "./reducer"
import { MediaState } from "./types"

const initialState: MediaState = {
  medias: [],
  isMediasLoading: false,
  mediasError: null,
  uploadUrl: null,
  isUploadLoading: false,
  uploadError: null,
  uploadProgress: null,
  isUploaded: false,
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
        dispatch({ type: "UPLOAD_LOADING", payload: true })
        dispatch({ type: "UPLOAD_START" })

        const { uploadUrl } = await generatePresignedUploadUrl({
          Filename: file.name,
          ContentType: contentType,
        })

        dispatch({ type: "UPLOAD_PRESIGN_SUCCESS", payload: uploadUrl })

        await uploadFileToPresignedUrl(file, uploadUrl, (progress) => {
          dispatch({ type: "UPLOAD_PROGRESS", payload: progress })
        })

        dispatch({ type: "UPLOAD_SUCCESS" })
        await fetchMedias()
      } catch {
        dispatch({
          type: "UPLOAD_ERROR",
          payload: "Failed to upload file",
        })
      } finally {
        dispatch({ type: "UPLOAD_LOADING", payload: false })
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
