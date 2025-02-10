import { PositiveInt } from "./Number/PositiveInt"

export function debounce<T extends unknown[]>(
  fn: (...args: T) => void,
  delayInMillis: number,
): (...args: T) => void {
  let timer: NodeJS.Timeout | null = null
  return (...args: T) => {
    if (timer) clearTimeout(timer)

    timer = setTimeout(() => {
      fn.call(null, ...args)
    }, delayInMillis)
  }
}

export type EveryClearFn = () => void
export function every(fn: () => void, internalMs: PositiveInt): EveryClearFn {
  const timer = setInterval(fn, internalMs.unwrap())
  return () => {
    clearTimeout(timer)
  }
}
