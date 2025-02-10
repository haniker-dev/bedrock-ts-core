import { Either } from "../Data/Either"

export function fromRight<E, T>(result: Either<E, T>): T {
  if (result._t === "Right") return result.value
  throw new Error(JSON.stringify(result.error, null, 2))
}

export function fromLeft<E, T>(result: Either<E, T>): E {
  if (result._t === "Left") return result.error
  throw new Error(
    "Supposed to fail but succeed with: " +
      JSON.stringify(result.value, null, 2),
  )
}
