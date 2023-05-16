import { describe, it, expect } from "vitest"
import { JWT } from "./JWT"

describe("JWT", () => {
  it("validate JWT", async () => {
    const secret = "some_random_secret"
    const payload = {
      id: 4000,
    }

    const token = await JWT.generate(secret, payload)
    expect(typeof token).toBe("string")

    const result = (await JWT.validate(secret, token)) as { id: number }
    expect(result.id).toBe(payload.id)
  })

  it("invalid token", async () => {
    const secret = "some_random_secret"
    const payload = {
      id: 4000,
    }

    const token = await JWT.generate(secret, payload)
    const result = (await JWT.validate(secret + "111", token)) as { id: number }
    expect(result).toBeFalsy()
  })
})
