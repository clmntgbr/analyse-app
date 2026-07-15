"use client"

import { Header } from "@/components/header"
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
    </div>
  )
}
