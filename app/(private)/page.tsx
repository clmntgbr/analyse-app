"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useMedia } from "@/lib/media/context"
import { useUser } from "@/lib/user/context"

export default function Page() {
  const { user } = useUser()
  const { uploadUrl, isLoading, error, generatePresignedUploadUrl } = useMedia()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleGenerate = async () => {
    if (!selectedFile) return

    await generatePresignedUploadUrl({
      Filename: selectedFile.name,
      ContentType: selectedFile.type || "application/octet-stream",
    })
  }

  return (
    <>
      <pre>{JSON.stringify(user, null, 2)}</pre>

      <div className="mt-4 flex flex-col gap-2">
        <input
          type="file"
          className="text-sm"
          onChange={(event) => {
            const file = event.target.files?.[0] ?? null
            setSelectedFile(file)
          }}
        />

        <Button
          onClick={handleGenerate}
          disabled={isLoading || !selectedFile}
        >
          {isLoading ? "Loading..." : "Generate presigned upload URL"}
        </Button>

        {error && <p className="text-destructive text-sm">{error}</p>}

        {uploadUrl && (
          <pre className="rounded-md bg-muted p-4 text-sm wrap-break-word">
            {uploadUrl}
          </pre>
        )}
      </div>
    </>
  )
}
