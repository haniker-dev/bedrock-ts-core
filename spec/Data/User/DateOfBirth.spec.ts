import {
  dateOfBirthDecoder,
  fromJsDateLocal,
  toJsDateLocal,
} from "../../../Data/User/DateOfBirth"

describe("Data/User/DateOfBirth", () => {
  test("decode DateOfBirth", async () => {
    const dob = dateOfBirthDecoder.verify("1981-01-27")
    expect(dob.toJSON()).toBe("1981-01-27T00:00:00Z")
  })

  test("checks invalid DateOfBirth", async () => {
    const invalidDate = dateOfBirthDecoder.decode("1981-02-31")
    expect(invalidDate.ok).toBe(false)

    const futureDate = dateOfBirthDecoder.decode("3000-01-01")
    expect(futureDate.ok).toBe(false)
  })

  // WARN This test is dependant on test runner's timezone
  // so it may not work everywhere
  test("handles timezone by taking only local date, not UTC date", async () => {
    // Assuming your test runner timezone is +8
    // sDate UTC is 1981-01-27T21:00:00 (add 1 hour)
    // sDate locally is 1981-01-28T05:00:00+08:00
    const mDate = new Date("1981-01-27T20:00:00-01:00")
    const dob = fromJsDateLocal(mDate)
    if (dob == null) {
      throw new Error("fromJsDateLocal returned null dob")
    }
    expect(dob.toJSON()).toBe("1981-01-28T00:00:00Z")

    // A JsDate from Dob is always expressed as local time
    const mDate2 = toJsDateLocal(dob)
    expect(mDate2.getFullYear()).toBe(1981)
    expect(mDate2.getMonth() + 1).toBe(1)
    expect(mDate2.getDate()).toBe(28)
  })
})
