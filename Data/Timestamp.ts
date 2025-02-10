import * as JD from "decoders"
import { Opaque, jsonValueCreate } from "./Opaque"
import { Either, fromRight, left, mapEither, right } from "./Either"
import { Maybe, throwIfNothing } from "./Maybe"
import { Nat } from "./Number/Nat"
import { PositiveInt } from "./Number/PositiveInt"

const key: unique symbol = Symbol()
/** Timestamp is epoch milliseconds
 * TODO We need Time/Second.ts, etc types
 * */
export type Timestamp = Opaque<number, typeof key>
export type ErrorTimestamp = "NOT_AN_INT" | "NOT_A_TIMESTAMP"

export function createNow(): Timestamp {
  return _create(epochSecondsNow())
}

export function fromDate(date: Date): Timestamp {
  return _create(date.getTime())
}

export function fromMillisecond(value: number): Maybe<Timestamp> {
  return createTimestamp(value)
}

export function toMillisecond(timestamp: Timestamp): number {
  return timestamp.unwrap()
}

export function createTimestamp(value: number): Maybe<Timestamp> {
  return fromRight(createTimestampE(value))
}

export function createTimestampE(n: number): Either<ErrorTimestamp, Timestamp> {
  return mapEither(_validate(n), jsonValueCreate(key))
}

export function afterNow(t: Timestamp): boolean {
  return epochSecondsNow() - t.unwrap() < 0
}

export function beforeNow(t: Timestamp): boolean {
  return t.unwrap() - epochSecondsNow() < 0
}

export function diffTimestamp(t1: Timestamp, t2: Timestamp): number {
  return t1.unwrap() - t2.unwrap()
}

export function diffFromNow(t1: Timestamp): number {
  return t1.unwrap() - epochSecondsNow()
}

export function addSeconds(t1: Timestamp, seconds: PositiveInt): Timestamp {
  return _create(t1.unwrap() + seconds.unwrap() * 1000)
}

export function isSameDay(a: Timestamp, b: Timestamp): boolean {
  const a_ = toDate(a).toDateString()
  const b_ = toDate(b).toDateString()
  return a_ === b_
}

export function yearAgo(n: Nat): Timestamp {
  const d = new Date()
  d.setFullYear(d.getFullYear() - n.unwrap())
  return fromDate(d)
}

export function yearFromNow(n: Nat): Timestamp {
  const d = new Date()
  d.setFullYear(d.getFullYear() + n.unwrap())
  return fromDate(d)
}

/**Past day is not include today*/
export function isPastDay(day: Timestamp): boolean {
  const day_ = new Date(toDate(day).setHours(0, 0, 0, 0))
  const now = new Date(new Date().setHours(0, 0, 0, 0))

  return day_.getTime() < now.getTime()
}

function epochSecondsNow(): number {
  return Math.floor(Date.now() / 1000)
}

export const timestampDecoder: JD.Decoder<Timestamp> = JD.number.transform(
  (n) => {
    return throwIfNothing(createTimestamp(n), `Invalid timestamp: ${n}`)
  },
)

function _validate(n: number): Either<ErrorTimestamp, number> {
  return Number.isInteger(n) === false
    ? left("NOT_AN_INT")
    : n <= 0
      ? left("NOT_A_TIMESTAMP")
      : right(n)
}

export function toDate(timestamp: Timestamp): Date {
  return new Date(timestamp.unwrap())
}

function _create(epochSeconds: number): Timestamp {
  return jsonValueCreate<number, typeof key>(key)(Math.floor(epochSeconds))
}
