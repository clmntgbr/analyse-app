"use client"

import { MediaItem } from "@/components/media-item"
import { UploadDropzone } from "@/components/upload-dropzone"
import { useMedia } from "@/lib/media/context"
import {
  createUploadFiles,
  revokeUploadFilePreviews,
  type UploadFile,
} from "@/lib/mock-upload"
import { useCallback, useEffect, useRef, useState } from "react"

export default function Page() {
  const { medias, uploadFile } = useMedia()
  const [pendingFiles, setPendingFiles] = useState<UploadFile[]>([])
  const [isSending, setIsSending] = useState(false)
  const pendingFilesRef = useRef(pendingFiles)

  pendingFilesRef.current = pendingFiles

  useEffect(() => {
    return () => {
      revokeUploadFilePreviews(pendingFilesRef.current)
    }
  }, [])

  const handleFiles = useCallback((files: File[]) => {
    setPendingFiles((current) => [...current, ...createUploadFiles(files)])
  }, [])

  const handleSend = useCallback(async () => {
    if (!pendingFiles.length || isSending) return

    setIsSending(true)

    try {
      for (const item of pendingFiles) {
        await uploadFile(item.file)
      }

      revokeUploadFilePreviews(pendingFiles)
      setPendingFiles([])
    } finally {
      setIsSending(false)
    }
  }, [isSending, pendingFiles, uploadFile])

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 p-4">
      <UploadDropzone
        onFiles={handleFiles}
        pendingFiles={pendingFiles}
        onSend={handleSend}
        isSending={isSending}
      />

      <div className="flex flex-col gap-4">
        <ul className="flex flex-col gap-2">
          {medias.members.map((media) => (
            <MediaItem key={media.id} item={media} />
          ))}
        </ul>
      </div>
    </div>
  )
}
