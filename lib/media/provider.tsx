"use client"

import { useCallback, useReducer } from "react"
import { generatePresignedUploadUrl, uploadFileToPresignedUrl } from "./api"
import { MediaContext } from "./context"
import { mediaReducer } from "./reducer"
import { MediaState } from "./types"

const initialState: MediaState = {
  uploadUrl: null,
  isLoading: false,
  error: null,
  uploadProgress: null,
  isUploaded: false,
}

export function MediaProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(mediaReducer, initialState)

  const uploadFile = useCallback(async (file: File) => {
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
    } catch {
      dispatch({
        type: "UPLOAD_ERROR",
        payload: "Failed to upload file",
      })
    } finally {
      dispatch({ type: "UPLOAD_LOADING", payload: false })
    }
  }, [])

  return (
    <MediaContext.Provider
      value={{
        ...state,
        uploadFile,
      }}
    >
      {children}
    </MediaContext.Provider>
  )
}
