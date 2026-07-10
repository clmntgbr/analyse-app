"use client"

import { MediaItem } from "@/components/media-item"
import { UploadDropzone } from "@/components/upload-dropzone"
import { Button } from "@/components/ui/button"
import { useMedia } from "@/lib/media/context"
import { useCallback } from "react"

export default function Page() {
  const { medias, fetchMedias, uploadFile } = useMedia()

  const handleFiles = useCallback(
    async (files: File[]) => {
      for (const file of files) {
        await uploadFile(file)
      }
    },
    [uploadFile]
  )

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 p-4">
      <div className="flex flex-col gap-4">
        <UploadDropzone onFiles={handleFiles} />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-medium">Medias</h2>
          <Button variant="outline" size="sm" onClick={fetchMedias}>
            Refresh
          </Button>
        </div>

        <ul className="flex flex-col gap-2">
          {medias.members.map((media) => (
            <MediaItem key={media.id} item={media} />
          ))}
        </ul>
      </div>
    </div>
  )
}
