import { JSONValue } from "decoders"
import { Maybe } from "./Maybe"

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
 *   const validated = cleanEmail(value)
 *   return mapEither(validated, (email) => ({
 *     [key]: email,
 *     unwrap: () => email,
 *     toJSON: () => email,
 *   }))
 * }
 *
 **/
export type Opaque<T, K extends symbol, Unwrapped = T> = {
  [key in K]: T
} & {
  readonly unwrap: () => Unwrapped
  readonly toJSON: () => JSONValue
}

// Equality Functions
// Because it depends on `unwrap()`,
// Unwrapped type must be the same as T
export function eq<T, K extends symbol>(
  a: Opaque<T, K, T>,
  b: Opaque<T, K, T>,
): boolean {
  return a.unwrap() === b.unwrap()
}

export function gt<T, K extends symbol>(
  a: Opaque<T, K, T>,
  b: Opaque<T, K, T>,
): boolean {
  return a.unwrap() > b.unwrap()
}

export function gte<T, K extends symbol>(
  a: Opaque<T, K, T>,
  b: Opaque<T, K, T>,
): boolean {
  return a.unwrap() >= b.unwrap()
}

export function lt<T, K extends symbol>(
  a: Opaque<T, K, T>,
  b: Opaque<T, K, T>,
): boolean {
  return a.unwrap() < b.unwrap()
}

export function lte<T, K extends symbol>(
  a: Opaque<T, K, T>,
  b: Opaque<T, K, T>,
): boolean {
  return a.unwrap() <= b.unwrap()
}

// Array Functions
// Because it depends on `unwrap()`,
// Unwrapped type must be the same as T
export function find<T, K extends symbol>(
  s: T,
  xs: Array<Opaque<T, K, T>>,
): Opaque<T, K, T> | null {
  const [first, ...rest] = xs
  if (first == null) {
    return null
  }

  return first.unwrap() === s ? first : find(s, rest)
}

export function unwrapMaybe<T, K extends symbol, U>(
  a: Maybe<Opaque<T, K, U>>,
): Maybe<U> {
  return a == null ? null : a.unwrap()
}

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
