import { createText3E } from "../../Data/Text"
import { _fromLeft } from "../Either"

describe("Data/Text", () => {
  test("Text too long", async () => {
    const tooLong = "1234"
    const result = _fromLeft(createText3E(tooLong))
    expect(result).toEqual("TEXT_TOO_LONG")
  })
})
