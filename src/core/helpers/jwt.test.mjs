import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { JWT } from "./jwt.mjs"

describe("JWT", () => {
  it("validate JWT", async () => {
    const secret = "some_random_secret"
    const payload = {
      id: 4000,
    }

    const token = await JWT.generate(secret, payload)
    assert.equal(typeof token, "string")

    const result = /** @type {{ id: number }} */ (await JWT.validate(secret, token))
    assert.equal(result.id, payload.id)
  })

  it("invalid token", async () => {
    const secret = "some_random_secret"
    const payload = {
      id: 4000,
    }

    const token = await JWT.generate(secret, payload)
    const result = /** @type {{ id: number }} */ (await JWT.validate(secret + "111", token))
    assert.equal(result, undefined)
  })
})
