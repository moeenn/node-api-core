import { test, expect } from "vitest"
import { JWT } from "./JWT.mjs"

test("validate JWT", async () => {
  const secret = "some_random_secret"
  const payload = {
    id: 4000,
  }

  const token = await JWT.generate({ secret, payload })
  expect(typeof token).toBe("string")

  /** @type {any} */
  const result = await JWT.validate({ secret, token })
  expect(result.id).toBe(payload.id)
})
