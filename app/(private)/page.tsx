"use client"

import { EmptyComponent } from "@/components/empty"
import { Header } from "@/components/header"
import { MediaItem } from "@/components/media-item"
import { UploadDropzone } from "@/components/upload-dropzone"
import { useMedia } from "@/lib/media/context"
import {
  createUploadFiles,
  revokeUploadFilePreviews,
  type UploadFile,
} from "@/lib/mock-upload"
import { useCallback, useEffect, useRef, useState } from "react"
import { ImageIcon } from "lucide-react"

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

  const handleCancel = useCallback(() => {
    if (isSending) return

    revokeUploadFilePreviews(pendingFiles)
    setPendingFiles([])
  }, [isSending, pendingFiles])

  return (
    <div className="container mx-auto flex max-w-6xl flex-col gap-8 p-4">
      <Header />
      <UploadDropzone
        onFiles={handleFiles}
        pendingFiles={pendingFiles}
        onSend={handleSend}
        onCancel={handleCancel}
        isSending={isSending}
      />

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-foreground">Medias</h2>

        {medias.members.length > 0 ? (
          <ul className="flex flex-col gap-3">
            {medias.members.map((media) => (
              <li key={media.id}>
                <MediaItem item={media} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyComponent
            title="Aucun média"
            description="Dépose un fichier pour lancer une première analyse."
            icon={<ImageIcon className="size-5 text-muted-foreground" />}
          />
        )}
      </section>
    </div>
  )
}
