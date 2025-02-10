import { createPassword } from "../../../Data/User/Password"

describe("Data/User/Password", () => {
  test("valid password", async () => {
    ;[
      "a@345678",
      "//00123123",
      "a@345⚠️78", // Emoji is considered a symbol based on our regex
      "1@#$%^&*()-=[];'/><.",
      ">>2a<<//",
      "Easy2Type&Safe",
    ].forEach((p) => {
      const pp = createPassword(p)
      if (pp == null) throw new Error(`{p} is invalid password`)
      expect(pp.unwrap()).toBe(p)
    })
  })

  test("invalid password", async () => {
    ;[
      "",
      " ",
      "1234567",
      "12345678",
      "a2345678",
      "a 345678",
      "@@##$$%%**",
    ].forEach((p) => {
      const pp = createPassword(p)
      expect(pp).toBe(null)
    })
  })
})
