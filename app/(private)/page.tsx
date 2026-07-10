"use client"

import { MediaItem } from "@/components/media-item"
import { Button } from "@/components/ui/button"
import { useMedia } from "@/lib/media/context"
import { useUser } from "@/lib/user/context"
import { useState } from "react"

export default function Page() {
  const { user } = useUser()
  const { medias, fetchMedias, uploadFile } = useMedia()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleUpload = async () => {
    if (!selectedFile) return
    await uploadFile(selectedFile)
  }

  return (
    <>
      <div className="mt-4 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-medium">Medias</h2>
            <Button variant="outline" size="sm" onClick={fetchMedias}>
              Refresh
            </Button>
          </div>
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

          <Button onClick={handleUpload} disabled={!selectedFile}>
            Upload file
          </Button>

          <pre className="rounded-md bg-muted p-4 text-sm wrap-break-word">
            {JSON.stringify(selectedFile, null, 2)}
          </pre>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        <h2 className="text-sm font-medium">Medias</h2>
        <div className="flex flex-col gap-2">
          {medias.members.map((media) => (
            <MediaItem key={media.id} item={media} />
          ))}
        </div>
      </div>
    </>
  )
}
