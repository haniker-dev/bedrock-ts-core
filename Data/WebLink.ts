import * as JD from "decoders"
import { Opaque, jsonValueCreate } from "./Opaque"
import { Either, left, right, fromRight, mapEither } from "./Either"
import { Maybe, throwIfNothing } from "./Maybe"

const key: unique symbol = Symbol()
export type WebLink = Opaque<string, typeof key>
export type ErrorWebLink = "INVALID_URL" | "EXCEEDED_MAX_LENGTH"

export function createWebLink(s: string): Maybe<WebLink> {
  return fromRight(createWebLinkE(s))
}

export function createWebLinkE(s: string): Either<ErrorWebLink, WebLink> {
  return mapEither(_validate(s), jsonValueCreate(key))
}

export const webLinkDecoder: JD.Decoder<WebLink> = JD.string.transform((s) => {
  return throwIfNothing(createWebLink(s), `Invalid url: ${s}`)
})

function _validate(s: string): Either<ErrorWebLink, string> {
  const MAX_URL_LENGTH = 2048
  if (s.length > MAX_URL_LENGTH) {
    return left("EXCEEDED_MAX_LENGTH")
  }
  try {
    new URL(s)
    return right(s)
  } catch (e) {
    return left("INVALID_URL")
  }
}
