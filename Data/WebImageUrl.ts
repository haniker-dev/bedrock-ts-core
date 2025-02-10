import * as JD from "decoders"
import { Opaque, jsonValueCreate } from "./Opaque"
import { Either, left, right, fromRight, mapEither } from "./Either"
import { Maybe, throwIfNothing } from "./Maybe"

export type WebImage = {
  _t: "WebImage"
  url: WebImageUrl
}

const key: unique symbol = Symbol()
export type WebImageUrl = Opaque<string, typeof key>
export type WebImageError =
  | "INVALID_URL"
  | "EXCEEDED_MAX_LENGTH"
  | "NOT_AN_IMAGE"

export function createWebImage(s: string): Maybe<WebImageUrl> {
  return fromRight(createWebImageE(s))
}

export function createWebImageE(s: string): Either<WebImageError, WebImageUrl> {
  return mapEither(_validate(s), jsonValueCreate(key))
}

function _validate(s: string): Either<WebImageError, string> {
  const MAX_URL_LENGTH = 2048
  if (s.length > MAX_URL_LENGTH) {
    return left("EXCEEDED_MAX_LENGTH")
  }
  try {
    new URL(s)

    const imageExtensions = ["jpeg", "jpg", "png"]
    const urlExtension = s.split(".").pop()?.toLowerCase() ?? null
    if (urlExtension == null) {
      return left("INVALID_URL")
    }
    return imageExtensions.includes(urlExtension)
      ? right(s)
      : left("NOT_AN_IMAGE")
  } catch (e) {
    return left("INVALID_URL")
  }
}

export const webImageUrlDecoder: JD.Decoder<WebImageUrl> = JD.string.transform(
  (s) => {
    return throwIfNothing(createWebImage(s), `Invalid url: ${s}`)
  },
)

export const webImageDecoder: JD.Decoder<WebImage> = JD.object({
  _t: JD.constant("WebImage"),
  url: webImageUrlDecoder,
})
