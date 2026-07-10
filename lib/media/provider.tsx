"use client"

import { useCallback, useReducer } from "react"
import { generatePresignedUploadUrl } from "./api"
import { MediaContext } from "./context"
import { mediaReducer } from "./reducer"
import { MediaState, PresignUploadInput } from "./types"

const initialState: MediaState = {
  uploadUrl: null,
  isLoading: false,
  error: null,
}

export function MediaProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(mediaReducer, initialState)

  const handleGeneratePresignedUploadUrl = useCallback(
    async (input: PresignUploadInput) => {
      try {
        dispatch({ type: "GET_PRESIGN_UPLOAD_URL_LOADING", payload: true })
        const { upload_url } = await generatePresignedUploadUrl(input)
        dispatch({ type: "GET_PRESIGN_UPLOAD_URL", payload: upload_url })
      } catch {
        dispatch({
          type: "GET_PRESIGN_UPLOAD_URL_ERROR",
          payload: "Failed to generate presigned upload url",
        })
      } finally {
        dispatch({ type: "GET_PRESIGN_UPLOAD_URL_LOADING", payload: false })
      }
    },
    []
  )

  return (
    <MediaContext.Provider
      value={{
        ...state,
        generatePresignedUploadUrl: handleGeneratePresignedUploadUrl,
      }}
    >
      {children}
    </MediaContext.Provider>
  )
}
