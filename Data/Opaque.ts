import { JSONValue } from "decoders"

/** An opaque type is a type where coders cannot create or edit it
 * thereby guaranteeing the integrity of the value
 * Use it after validation, sanitisation or to hide inner value
 *
 * Coder must pass in a unique symbol for K in order to work
 * else if T is the same between two opaque types,
 * the two opaque types are considered equal in TS
 * Eg. Text256 == Email (if T is the same)
 *
 * Code Example:
 * const key: unique symbol = Symbol()
 * type Email = Opaque<string, typeof key>
 * export function createEmailE(value: string): Either<Error, Email> {
 *   const isValid = validateEmail(value)
 *   if (isValue === true) {
 *     const opaqueType = {
 *       [key]: email,
 *       unwrap: () => email,
 *       toJSON: () => email,
 *     }
 *     return { _t: "Right", value: opaqueType }
 *   } else {
 *     return { _t: "Left", error: "INVALID_EMAIL"}
 *   }
 * }
 *
 **/
export type Opaque<T, K extends symbol, Unwrapped = T> = {
  [key in K]: T
} & {
  readonly unwrap: () => Unwrapped
  readonly toJSON: () => JSONValue
}

/**
 * A factory to create opaque type if the wrapped value is a kind of JSONValue
 */
export function jsonValueCreate<T extends JSONValue, K extends symbol>(
  key: K,
): (v: T) => Opaque<T, K> {
  return (value: T) => {
    return {
      [key]: value,
      unwrap: function () {
        return this[key]
      },
      toJSON: function () {
        return this[key]
      },
    }
  }
}
