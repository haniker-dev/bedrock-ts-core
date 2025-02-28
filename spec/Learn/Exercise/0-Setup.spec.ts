import { User, getName } from "../../../Learn/Exercise/0-Setup"

describe("0-Setup", () => {
  test("Can get name", async () => {
    const user: User = {
      name: "John",
      email: "hello",
    }
    expect(getName(user)).toEqual("John")
  })
})
