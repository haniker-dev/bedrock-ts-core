import { PositiveInt } from "./Number/PositiveInt"

export type PaginationData<E, T> =
  | NotAsked
  | Loading
  | Failure<E>
  | Loaded<T>
  | LoadingMore<T>
  | LoadingNew<T>
  | NoMore<T>

export type NotAsked = { _t: "NotAsked" }
export type Loading = { _t: "Loading" }
export type Failure<E> = { _t: "Failure"; error: E }
export type Loaded<T> = { _t: "Loaded"; data: T }
export type LoadingNew<T> = { _t: "LoadingNew"; data: T }
export type LoadingMore<T> = { _t: "LoadingMore"; data: T }
export type NoMore<T> = { _t: "NoMore"; data: T }

export function notAsked<E, T>(): PaginationData<E, T> {
  return { _t: "NotAsked" }
}

export function loading<E, T>(): PaginationData<E, T> {
  return { _t: "Loading" }
}

export function failure<E, T>(error: E): PaginationData<E, T> {
  return { _t: "Failure", error }
}

export function loaded<E, T>(data: T): PaginationData<E, T> {
  return { _t: "Loaded", data }
}

export function loadingMore<E, T>(data: T): PaginationData<E, T> {
  return { _t: "LoadingMore", data }
}

export function loadingNew<E, T>(data: T): PaginationData<E, T> {
  return { _t: "LoadingNew", data }
}

export function noMore<E, T>(data: T): PaginationData<E, T> {
  return { _t: "NoMore", data }
}

export function map<E, T>(
  fn: (t: T) => T,
  paginationData: PaginationData<E, T>,
): PaginationData<E, T> {
  switch (paginationData._t) {
    case "NoMore":
    case "LoadingMore":
    case "Loaded":
      return { ...paginationData, data: fn(paginationData.data) }
    default:
      return paginationData
  }
}

export function getError<E, T>(paginationData: PaginationData<E, T>): E | null {
  return paginationData._t === "Failure" ? paginationData.error : null
}

export function getData<E, T>(paginationData: PaginationData<E, T>): T | null {
  switch (paginationData._t) {
    case "NoMore":
    case "LoadingNew":
    case "LoadingMore":
    case "Loaded":
      return paginationData.data
    default:
      return null
  }
}

export function updateData<E, T>(
  data: T,
  paginationData: PaginationData<E, T>,
): PaginationData<E, T> {
  switch (paginationData._t) {
    case "NoMore":
    case "LoadingNew":
    case "LoadingMore":
    case "Loaded":
      return { _t: paginationData._t, data }
    default:
      return paginationData
  }
}

export function appendNewData<E, T>(
  oldData: PaginationData<E, Array<T>>,
  newData: Array<T>,
  limit: PositiveInt,
): PaginationData<E, Array<T>> {
  const data = [...(getData(oldData) ?? []), ...newData]
  if (newData.length < limit.unwrap()) {
    return noMore(data)
  }
  return loaded(data)
}

export function prependNewData<E, T>(
  oldData: PaginationData<E, Array<T>>,
  newData: Array<T>,
): PaginationData<E, Array<T>> {
  const data = [...newData, ...(getData(oldData) ?? [])]
  switch (oldData._t) {
    case "NotAsked":
    case "Failure":
    case "Loaded":
    case "LoadingMore":
    case "Loading":
    case "LoadingNew":
      return loaded(data)
    case "NoMore":
      return noMore(data)
  }
}
