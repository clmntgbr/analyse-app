import { useCallback, useRef, useState } from "react"
import { CloudUpload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface UploadDropzoneProps {
  onFiles: (files: File[]) => void
}

const ACCEPT =
  ".jpg,.jpeg,.png,.mp4,.mov,image/jpeg,image/png,video/mp4,video/quicktime"

export function UploadDropzone({ onFiles }: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const dragCounter = useRef(0)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      dragCounter.current = 0
      setDragging(false)
      const dropped = Array.from(e.dataTransfer.files)
      if (dropped.length) onFiles(dropped)
    },
    [onFiles]
  )

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Zone de dépôt de fichiers — clique ou dépose des images et vidéos"
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          inputRef.current?.click()
        }
      }}
      onDragEnter={(e) => {
        e.preventDefault()
        dragCounter.current++
        setDragging(true)
      }}
      onDragLeave={(e) => {
        e.preventDefault()
        dragCounter.current--
        if (dragCounter.current <= 0) setDragging(false)
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className={cn(
        "group relative flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed px-6 py-14 text-center transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:py-20",
        dragging
          ? "border-primary bg-accent scale-[1.01] shadow-lg"
          : "border-border bg-card hover:border-primary/50 hover:bg-accent/50"
      )}
    >
      <div
        className={cn(
          "flex size-16 items-center justify-center rounded-full transition-colors",
          dragging
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-primary"
        )}
      >
        <CloudUpload className="size-8" aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <p className="text-lg font-semibold text-foreground">
          {dragging
            ? "Lâche tes fichiers ici !"
            : "Dépose ton image ou vidéo ici, ou clique pour parcourir"}
        </p>
        <p className="text-sm text-muted-foreground">
          JPG, PNG, MP4 ou MOV — 100 Mo max par fichier, plusieurs fichiers
          acceptés
        </p>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="pointer-events-none sm:pointer-events-auto"
        onClick={(e) => {
          e.stopPropagation()
          inputRef.current?.click()
        }}
      >
        Parcourir les fichiers
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        multiple
        className="sr-only"
        onChange={(e) => {
          const selected = Array.from(e.target.files ?? [])
          if (selected.length) onFiles(selected)
          e.target.value = ""
        }}
      />
    </div>
  )
}
