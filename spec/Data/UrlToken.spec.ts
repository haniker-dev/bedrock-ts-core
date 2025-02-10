import { createText3 } from "../../Data/Text"
import { toStringRecord } from "../../Data/UrlToken"

describe("Data/UrlToken", () => {
  test("Stringify record string properly", async () => {
    const text3 = createText3("ABC")
    if (text3 == null) throw new Error("Invalid Text3")
    const data = {
      value: text3,
    }
    const result = toStringRecord(data)
    expect(result).toEqual({ value: "ABC" })
  })
})
