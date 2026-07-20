"use client"

import { useCallback, useEffect, useReducer } from "react"
import { initPaginate } from "../paginate"
import {
  generatePresignedUploadUrl,
  getAnalyses,
  getAnalysis,
  uploadFileToPresignedUrl,
} from "./api"
import { AnalysisContext } from "./context"
import { analysisReducer } from "./reducer"
import { Analysis, AnalysisState } from "./types"

const initialState: AnalysisState = {
  analyses: initPaginate<Analysis>(),
  isAnalysesLoading: false,
  analysesError: null,
}

export function AnalysisProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(analysisReducer, initialState)

  const fetchAnalyses = useCallback(async () => {
    try {
      dispatch({ type: "GET_ANALYSES_LOADING", payload: true })
      const analyses = await getAnalyses()
      dispatch({ type: "GET_ANALYSES", payload: analyses })
    } catch {
      dispatch({
        type: "GET_ANALYSES_ERROR",
        payload: "Failed to fetch analyses",
      })
    } finally {
      dispatch({ type: "GET_ANALYSES_LOADING", payload: false })
    }
  }, [])

  const fetchAnalysis = useCallback(async (id: string) => {
    return getAnalysis(id)
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

        await fetchAnalyses()
      } catch {
        console.error("Failed to upload file")
      }
    },
    [fetchAnalyses]
  )

  useEffect(() => {
    fetchAnalyses()
  }, [fetchAnalyses])

  return (
    <AnalysisContext.Provider
      value={{
        ...state,
        fetchAnalyses,
        fetchAnalysis,
        uploadFile,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  )
}
