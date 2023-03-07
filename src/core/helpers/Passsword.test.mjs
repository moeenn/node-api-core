import { test, expect } from "vitest"
import { Password } from "./Password.mjs"

test("valid password hashing and checking", async () => {
  const pwd = "random_password_300"
  const hash = await Password.hash(pwd)
  const isValid = await Password.verify(hash, pwd)

  expect(isValid).toBe(true)
})

test("invalid password hashing and checking", async () => {
  const pwd = "random_password"
  const hash = await Password.hash(pwd)
  const isValid = await Password.verify(hash, "ascascc")

  expect(isValid).toBe(false)
})
