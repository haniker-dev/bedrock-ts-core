import { deepEqual } from "../../Data/deepEquality"
import { Nat100, Nat300 } from "../../Data/Number/Nat"
import { PositiveInt100, PositiveInt20 } from "../../Data/Number/PositiveInt"
import { text100Decoder } from "../../Data/Text"

describe("/Data/deepEquality", () => {
  test("Primitives & Simple Objects", () => {
    const objA = { prop1: "propA", prop2: 123, prop3: true, prop4: Symbol("A") }
    const objB = { ...objA }
    const objC = { ...objA, prop1: "propC" }
    const objD = { ...objA, prop2: 234 }
    const objE = { ...objA, prop3: false }
    const objF = { ...objA, prop4: Symbol("A") }
    const objG = { ...objA, extraProp: "extra" }

    expect(deepEqual(objA, objA)).toBeTruthy()
    expect(deepEqual(objA, objB)).toBeTruthy()
    expect(deepEqual(objA, objC)).toBeFalsy()
    expect(deepEqual(objA, objD)).toBeFalsy()
    expect(deepEqual(objA, objE)).toBeFalsy()
    expect(deepEqual(objA, objF)).toBeFalsy()
    expect(deepEqual(objA, objG)).toBeFalsy()
    expect(deepEqual(objA, null)).toBeFalsy()
  })

  test("Arrays", () => {
    const arrayA = ["MentalWellness", "EnablingYouths", "Sustainability"]
    const arrayB = [...arrayA]
    const arrayC = [...arrayA, "Sustainability_Error"]
    const arrayD = [...arrayA, { extraObj: "extra" }]

    expect(deepEqual(arrayA, arrayB)).toBeTruthy()
    expect(deepEqual(arrayA, arrayC)).toBeFalsy()
    expect(deepEqual(arrayA, arrayD)).toBeFalsy()
    expect(deepEqual(arrayA, null)).toBeFalsy()
  })

  test("Nested Objects", () => {
    const objA = {
      myArray: ["A", "B", "C"],
      myNat: Nat100,
      myPositiveInt: PositiveInt100,
      myText: text100Decoder.verify("myText"),
      more: {
        myFunction: (): boolean => {
          return true
        },
      },
    }
    const objB = { ...objA }
    const objC = { ...objA, myArray: ["A", "B", "D"] }
    const objD = { ...objA, myNat: Nat300 }
    const objE = { ...objA, myPositiveInt: PositiveInt20 }
    const objF = { ...objA, myText: text100Decoder.verify("different Text") }

    expect(deepEqual(objA, objB)).toBeTruthy()
    expect(deepEqual(objA, objC)).toBeFalsy()
    expect(deepEqual(objA, objD)).toBeFalsy()
    expect(deepEqual(objA, objE)).toBeFalsy()
    expect(deepEqual(objA, objF)).toBeFalsy()
    expect(deepEqual(objA, undefined)).toBeFalsy()
  })
})
