import * as RC from "../../Data/RemoteCache"
import { Nat0, Nat1 } from "../../Data/Number/Nat"
import { Either, left, right } from "../../Data/Either"

describe("/Data/RemoteCache", () => {
  test("Same Params - Refreshing", async () => {
    let wasCalled = false

    function callMeOnce(_p: boolean): Promise<Either<null, boolean>> {
      if (!wasCalled) {
        wasCalled = true
        return Promise.resolve(right(true))
      }
      return Promise.resolve(left(null))
    }

    const rc0 = RC.init(Nat1, callMeOnce)

    const rc1 = await RC.fetch(false, rc0)
    const response1 = rc1.unwrap()
    expect(response1._t).toBe("Success")
    if (response1._t === "Success") expect(response1.data).toBeTruthy()

    const response2 = await RC.fetch(false, rc1).then((r) => r.unwrap())
    expect(response2._t).toBe("Success")
    if (response2._t === "Success") expect(response2.data).toBeTruthy()
  })

  test("Same Params - FailedWithCache", async () => {
    let wasCalled = false

    function callMeOnce(_p: boolean): Promise<Either<null, boolean>> {
      if (!wasCalled) {
        wasCalled = true
        return Promise.resolve(right(true))
      }
      return Promise.resolve(left(null))
    }

    const rc0 = RC.init(Nat0, callMeOnce)

    const rc1 = await RC.fetch(false, rc0)
    const response1 = rc1.unwrap()
    expect(response1._t).toBe("Success")
    if (response1._t === "Success") expect(response1.data).toBeTruthy()

    const response2 = await RC.fetch(false, rc1).then((r) => r.unwrap())
    expect(response2._t).toBe("FailedWithCache")
    if (response2._t === "FailedWithCache") expect(response2.data).toBeTruthy()
  })

  test("Different Params - Success", async () => {
    function callMeAnytime(p: number): Promise<Either<null, number>> {
      return Promise.resolve(right(p))
    }

    const rc0 = RC.init(Nat1, callMeAnytime)

    const rc1 = await RC.fetch(123, rc0)
    const response1 = rc1.unwrap()
    expect(response1._t).toBe("Success")
    if (response1._t === "Success") expect(response1.data).toEqual(123)

    const response2 = await RC.fetch(456, rc1).then((r) => r.unwrap())
    expect(response2._t).toBe("Success")
    if (response2._t === "Success") expect(response2.data).toEqual(456)
  })
})
