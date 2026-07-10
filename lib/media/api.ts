import { PresignUploadInput, PresignedUploadUrlResponse } from "./types"

export const generatePresignedUploadUrl = async (
  input: PresignUploadInput
): Promise<PresignedUploadUrlResponse> => {
  const response = await fetch("/api/media/presign-upload-url", {
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
