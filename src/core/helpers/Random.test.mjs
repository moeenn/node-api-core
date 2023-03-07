import { test, expect } from "vitest"
import { Random } from "./Random.mjs"

test("random strings", async () => {
  const one = await Random.string(10)
  const two = await Random.string(10)

  expect(one === two).toBe(false)
})

test("random int", async () => {
  const min = 20
  const max = 30

  const result = await Random.int(min, max)
  expect(result >= min && result <= max).toBe(true)
})

test("random pin", async () => {
  const pin = await Random.pin(10)
  expect(pin.length).toBe(10)
})
