// reference:
// https://medium.com/@stheodorejohn/javascript-object-deep-equality-comparison-in-javascript-7aa227e889d4

export function deepEqual<T>(a: T, b: T): boolean {
  if (a === b) {
    // Note: this powerful statement covers all shallow comparisons, primitives, undefined and null
    return true
  }

  if (a === null || b === null) return false
  if (typeof a !== "object" || typeof b !== "object") return false

  const keysA = Object.keys(a)
  const keysB = Object.keys(b)
  if (keysA.length !== keysB.length) return false

  for (const key in a) {
    if (!keysB.includes(key)) return false
    if (!deepEqual(a[key], b[key])) return false
  }

  return true
}
