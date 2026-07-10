"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useMedia } from "@/lib/media/context"
import { useUser } from "@/lib/user/context"

export default function Page() {
  const { user } = useUser()
  const {
    medias,
    isMediasLoading,
    mediasError,
    uploadUrl,
    isUploadLoading,
    uploadError,
    uploadProgress,
    isUploaded,
    fetchMedias,
    uploadFile,
  } = useMedia()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleUpload = async () => {
    if (!selectedFile) return
    await uploadFile(selectedFile)
  }

  return (
    <>
      <pre>{JSON.stringify(user, null, 2)}</pre>

      <div className="mt-4 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-medium">Medias</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchMedias}
              disabled={isMediasLoading}
            >
              {isMediasLoading ? "Loading..." : "Refresh"}
            </Button>
          </div>

          {mediasError && (
            <p className="text-destructive text-sm">{mediasError}</p>
          )}

          {isMediasLoading && medias.length === 0 ? (
            <p className="text-muted-foreground text-sm">Loading medias...</p>
          ) : (
            <pre className="rounded-md bg-muted p-4 text-sm">
              {JSON.stringify(medias, null, 2)}
            </pre>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-medium">Upload</h2>

          <input
            type="file"
            className="text-sm"
            onChange={(event) => {
              const file = event.target.files?.[0] ?? null
              setSelectedFile(file)
            }}
          />

          <Button
            onClick={handleUpload}
            disabled={isUploadLoading || !selectedFile}
          >
            {isUploadLoading ? "Uploading..." : "Upload file"}
          </Button>

          {uploadProgress !== null && (
            <div className="flex flex-col gap-1">
              <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                <div
                  className="bg-primary h-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-muted-foreground text-sm">{uploadProgress}%</p>
            </div>
          )}

          {uploadError && (
            <p className="text-destructive text-sm">{uploadError}</p>
          )}

          {isUploaded && (
            <p className="text-sm text-green-600">
              Upload completed successfully
            </p>
          )}

          {uploadUrl && (
            <pre className="rounded-md bg-muted p-4 text-sm wrap-break-word">
              {uploadUrl}
            </pre>
          )}
        </div>
      </div>
    </>
  )
}
