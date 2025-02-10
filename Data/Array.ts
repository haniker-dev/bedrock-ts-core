import { Maybe } from "./Maybe"

/** Break an array into its last element and all preceding elements.
 * Function naming from:
 * https://pursuit.purescript.org/packages/purescript-arrays/7.3.0/docs/Data.Array#v:unsnoc
 */
export function unsnoc<T>(xs: T[]): Maybe<{ init: T[]; last: T }> {
  const init = [...xs]
  const last = init.pop() // Mutation!

  return last == null ? null : { init, last }
}

export function uniqueBy<T, K>(array: T[], compareValue: (item: T) => K): T[] {
  return array.reduce((acc: T[], item) => {
    const value = compareValue(item)
    if (!acc.some((existingItem) => compareValue(existingItem) === value)) {
      acc.push(item)
    }
    return acc
  }, [])
}

export function removeNull<T>(array: Maybe<T>[]): T[] {
  return array.reduce(
    (acc: T[], curr) => (curr == null ? acc : [...acc, curr]),
    [],
  )
}
