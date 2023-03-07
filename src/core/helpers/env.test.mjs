import { test, expect } from "vitest"
import { env } from "./env.mjs"

test("get env value which is already set", () => {
  const result = env("NODE_ENV")
  expect(result).toBe("test")
})

test("get env value which hasn't been set", () => {
  const call = () => env("SOME_RANDOM_SHITTY_VALUE")
  expect(call).toThrowError("not set")
})
