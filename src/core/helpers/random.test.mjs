import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { Random } from "./random.mjs"

describe("Random helper", () => {
  it("random strings", async () => {
    const one = await Random.string(10)
    const two = await Random.string(10)

    assert.equal(one === two, false)
  })

  it("random int", async () => {
    const min = 20
    const max = 30

    const result = await Random.int(min, max)
    assert.ok(result >= min && result <= max)
  })

  it("random pin", async () => {
    const pin = await Random.pin(10)
    assert.equal(pin.length, 10)
  })
})
