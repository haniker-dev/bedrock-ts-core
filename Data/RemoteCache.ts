import { Either } from "./Either"
import { Maybe, nothing } from "./Maybe"
import { Nat } from "./Number/Nat"
import { Opaque } from "./Opaque"
import { RemoteData } from "./RemoteData"
import { createNow, diffTimestamp, Timestamp } from "./Timestamp"
import { deepEqual } from "./deepEquality"

const key: unique symbol = Symbol()
export type RemoteCache<P, E, T> = Opaque<
  RemoteCacheInternal<P, E, T>,
  typeof key,
  State<E, T>
>

type RemoteCacheInternal<P, E, T> = {
  lastParam: Maybe<P>
  lastFetched: Timestamp
  expireInSeconds: Nat
  state: State<E, T>
  fetchData: (p: P) => Promise<Either<E, T>>
}

export type State<E, T> =
  | RemoteData<E, T>
  | Refreshing<T>
  | FailedWithCache<E, T>

export type Refreshing<T> = { _t: "Refreshing"; data: T }
export type FailedWithCache<E, T> = { _t: "FailedWithCache"; data: T; error: E }

export function init<P, E, T>(
  expireInSeconds: Nat,
  fetchData: (p: P) => Promise<Either<E, T>>,
): RemoteCache<P, E, T> {
  return create(createNow(), expireInSeconds, { _t: "NotAsked" }, fetchData)
}

export function getState<P, E, T>(
  remoteCache: RemoteCache<P, E, T>,
): State<E, T> {
  return remoteCache[key].state
}

/** BEWARE: updating state to "Loading" will clear any cached data of this RC instance */
export function updateState<P, E, T>(
  state: State<E, T>,
  remoteCache: RemoteCache<P, E, T>,
): RemoteCache<P, E, T> {
  return updateState_(state, remoteCache)
}

export function getData<P, E, T>(remoteCache: RemoteCache<P, E, T>): Maybe<T> {
  const { state } = remoteCache[key]
  switch (state._t) {
    case "NotAsked":
    case "Loading":
    case "Failure":
      return nothing()
    case "Success":
    case "Refreshing":
    case "FailedWithCache":
      return state.data
  }
}

// TODO: Invent a way to return refreshing/Loading/FailedWithCache/Failure
export async function fetch<P, E, T>(
  p: P,
  remoteCache: RemoteCache<P, E, T>,
): Promise<RemoteCache<P, E, T>> {
  const { lastFetched, expireInSeconds, state, lastParam, fetchData } =
    remoteCache[key]

  if (
    (state._t === "Success" || state._t === "Refreshing") &&
    diffTimestamp(createNow(), lastFetched) < expireInSeconds.unwrap() &&
    deepEqual(p, lastParam)
  ) {
    return success(state.data, remoteCache, "Success")
  } else {
    return fetchData(p).then((r) =>
      r._t === "Left"
        ? failure(r.error, remoteCache, p)
        : success(r.value, updateLastParamAndTime(p, remoteCache), "Success"),
    )
  }
}

// Internal

function failure<P, E, T>(
  error: E,
  remoteCache: RemoteCache<P, E, T>,
  p: P,
): RemoteCache<P, E, T> {
  const { state } = remoteCache[key]
  switch (state._t) {
    case "NotAsked":
    case "Loading":
    case "Failure":
      return updateState_(
        { _t: "Failure", error },
        updateLastParamAndTime(p, remoteCache),
      )
    case "Success":
    case "Refreshing":
    case "FailedWithCache": {
      const { lastParam } = remoteCache[key]
      const sameParams = deepEqual(p, lastParam)

      return sameParams
        ? updateState_(
            { _t: "FailedWithCache", data: state.data, error },
            remoteCache,
          )
        : updateState_(
            { _t: "Failure", error },
            updateLastParamAndTime(p, remoteCache),
          )
    }
  }
}

function success<P, E, T>(
  data: T,
  remoteCache: RemoteCache<P, E, T>,
  newState: "Success" | "Refreshing",
): RemoteCache<P, E, T> {
  return updateState_({ _t: newState, data }, remoteCache)
}

function updateState_<P, E, T>(
  state: State<E, T>,
  remoteCache: RemoteCache<P, E, T>,
): RemoteCache<P, E, T> {
  return {
    [key]: {
      ...remoteCache[key],
      state,
    },
    unwrap: function () {
      return this[key].state
    },
    toJSON: function () {
      return JSON.stringify(this[key].state)
    },
  }
}

function updateLastParamAndTime<P, E, T>(
  lastParam: P,
  remoteCache: RemoteCache<P, E, T>,
): RemoteCache<P, E, T> {
  return {
    [key]: { ...remoteCache[key], lastParam, lastFetched: createNow() },
    unwrap: function () {
      return this[key].state
    },
    toJSON: function () {
      return JSON.stringify(this[key].state)
    },
  }
}

function create<P, E, T>(
  lastFetched: Timestamp,
  expireInSeconds: Nat,
  state: State<E, T>,
  fetchData: (p: P) => Promise<Either<E, T>>,
): RemoteCache<P, E, T> {
  return {
    [key]: { lastFetched, expireInSeconds, state, fetchData, lastParam: null },
    unwrap: function () {
      return this[key].state
    },
    toJSON: function () {
      return JSON.stringify(this[key].state)
    },
  }
}
