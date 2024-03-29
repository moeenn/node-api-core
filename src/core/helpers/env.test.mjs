import { test } from "node:test"
import assert from "node:assert/strict"
import { env } from "./env.mjs"

test("env helper", async (t) => {
  await t.test("get env value which is already set", () => {
    const result = env("NODE_ENV")
    assert.equal(result, "test")
  })

  await t.test("get env value which hasn't been set", () => {
    const call = () => env("SOME_RANDOM_UNKNOWN_VALUE")
    assert.throws(call, { message: /not set/ })
  })
})
