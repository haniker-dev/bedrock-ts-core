import { Either, fromLeft, fromRight } from "../Either"
import { Maybe } from "../Maybe"
import { Opaque } from "../Opaque"

const fieldKey: unique symbol = Symbol()
/** Captures error with input value
 * It does *NOT* validate until you call *parse*
 * Do your own validation at the Actions!
 */
export type Field<E, T> = Opaque<FieldInternal<E, T>, typeof fieldKey, string>

export type FieldInternal<E, T> = {
  valueStr: string
  parser: ParseDontValidateFn<E, T>
  _memo: Maybe<Either<E, T>>
}

export type ParseDontValidateFn<E, T> = (s: string) => Either<E, T>

export function init<E, T>(
  valueStr: string,
  parser: ParseDontValidateFn<E, T>,
): Field<E, T> {
  return _create({
    valueStr,
    parser,
    _memo: null,
  })
}

export function parse<E, T>(f: Field<E, T>): Field<E, T> {
  const fi = _internal(f)
  return _create({ ...fi, _memo: fi.parser(fi.valueStr) })
}

export function change<E, T>(valueStr: string, f: Field<E, T>): Field<E, T> {
  const fi = _internal(f)
  return _create({ ...fi, valueStr })
}

export function clearError<E, T>(f: Field<E, T>): Field<E, T> {
  const fi = _internal(f)
  return _create({ ...fi, _memo: null })
}

export function error<E, T>(f: Field<E, T>): Maybe<E> {
  const fi = _internal(f)
  return fi._memo == null ? null : fromLeft(fi._memo)
}

export function value<E, T>(f: Field<E, T>): Maybe<T> {
  const fi = _internal(f)
  return fi._memo == null ? null : fromRight(fi._memo)
}

function _create<E, T>(f: FieldInternal<E, T>): Field<E, T> {
  return {
    [fieldKey]: f,
    unwrap: function () {
      return this[fieldKey].valueStr
    },
    toJSON: function () {
      return this[fieldKey].valueStr
    },
  }
}

function _internal<E, T>(f: Field<E, T>): FieldInternal<E, T> {
  return f[fieldKey]
}
