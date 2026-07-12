export interface UploadFile {
  id: string
  file: File
  previewUrl?: string
}

export function createUploadFiles(files: File[]): UploadFile[] {
  return files.map((file) => ({
    id: crypto.randomUUID(),
    file,
    previewUrl: file.type.startsWith("image/")
      ? URL.createObjectURL(file)
      : undefined,
  }))
}

export function revokeUploadFilePreviews(files: UploadFile[]): void {
  for (const item of files) {
    if (item.previewUrl) {
      URL.revokeObjectURL(item.previewUrl)
    }
  }
}
