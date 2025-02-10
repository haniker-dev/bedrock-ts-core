import { JSONValue } from "decoders"
import { Opaque, jsonValueCreate } from "./Opaque"

const key: unique symbol = Symbol()
export type Stacks<S extends JSONValue> = Opaque<Array<S>, typeof key>

export function createStacks<S extends JSONValue>(): Stacks<S> {
  return jsonValueCreate<Array<S>, typeof key>(key)([])
}

export function pushStack<S extends JSONValue>(
  stack: S,
  stacks: Stacks<S>,
): Stacks<S> {
  const newStacks = [...stacks.unwrap()]
  newStacks.push(stack)
  return jsonValueCreate<Array<S>, typeof key>(key)(newStacks)
}

export function popStack<S extends JSONValue>(stacks: Stacks<S>): Stacks<S> {
  const newStacks = [...stacks.unwrap()]
  newStacks.pop()
  return jsonValueCreate<Array<S>, typeof key>(key)(newStacks)
}
