import { Paginate } from "../paginate"
import {
  GeneratePresignedUploadUrlDetailResponse,
  Media,
  PresignUploadInput,
} from "./types"

export const getMedias = async (): Promise<Paginate<Media>> => {
  const response = await fetch("/api/medias", {
    method: "GET",
  })

  if (!response.ok) {
    throw new Error("Failed to fetch medias")
  }

  return response.json()
}

export const getMedia = async (id: string): Promise<Media> => {
  const response = await fetch(`/api/medias/${id}`, {
    method: "GET",
  })

  if (!response.ok) {
    throw new Error("Failed to fetch media")
  }

  const payload = (await response.json()) as { data?: Media } | Media

  if ("data" in payload && payload.data) {
    return payload.data
  }

  return payload as Media
}

export const generatePresignedUploadUrl = async (
  input: PresignUploadInput
): Promise<GeneratePresignedUploadUrlDetailResponse> => {
  const response = await fetch("/api/medias/presign-upload-url", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    throw new Error("Failed to generate presigned upload url")
  }

  return response.json()
}

export const uploadFileToPresignedUrl = (
  file: File,
  presignedUrl: string,
  onProgress?: (progress: number) => void
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open("PUT", presignedUrl)
    xhr.setRequestHeader(
      "Content-Type",
      file.type || "application/octet-stream"
    )

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100))
      }
    }

    xhr.onload = () => {
      if (xhr.status < 300) {
        resolve()
        return
      }

      reject(new Error(`Upload failed: ${xhr.status}`))
    }

    xhr.onerror = () => reject(new Error("Upload failed"))
    xhr.send(file)
  })
}
