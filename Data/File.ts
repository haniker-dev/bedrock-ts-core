import * as JD from "decoders"

export type FileExtension = "MP4" | "PNG" | "JPG" | "JPEG"
export function getFileExtension(filename: string): FileExtension | null {
  const lastDotIndex = filename.lastIndexOf(".")
  return lastDotIndex !== -1 && lastDotIndex < filename.length - 1
    ? fileExtensionDecoder.value(
        filename.substring(lastDotIndex + 1).toUpperCase(),
      ) || null
    : null
}

export function fileExtensionString(fileExtension: FileExtension): string {
  switch (fileExtension) {
    case "MP4":
      return "mp4"
    case "PNG":
      return "png"
    case "JPG":
      return "jpg"
    case "JPEG":
      return "jpeg"
  }
}

export function toContentType(fileExtension: FileExtension): string {
  switch (fileExtension) {
    case "MP4":
      return "video/mp4"
    case "PNG":
      return "image/png"
    case "JPG":
      return "image/jpg"
    case "JPEG":
      return "image/jpeg"
  }
}

const fileExtensionDecoder: JD.Decoder<FileExtension> = JD.oneOf([
  "MP4",
  "PNG",
  "JPG",
  "JPEG",
])
