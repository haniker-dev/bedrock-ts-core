import type { Config } from "jest"

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["Api", "App", "Data", "spec"],
}

export default config
