import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { Password } from "./password.mjs"

describe("Password", () => {
  it("valid password hashing and checking", async () => {
    const pwd = "random_password_300"
    const hash = await Password.hash(pwd)
    const isValid = await Password.verify(hash, pwd)

    assert.ok(isValid)
  })

  it("invalid password hashing and checking", async () => {
    const pwd = "random_password"
    const hash = await Password.hash(pwd)
    const isValid = await Password.verify(hash, "ascascc")

    assert.equal(isValid, false)
  })

  it("weak password strength test", async () => {
    const weak = await Password.checkStrength("1231231")
    assert.equal(weak.strong, false)
    assert.ok(weak.errors.length)
  })

  it("strong password strength test", async () => {
    const result = await Password.checkStrength("!@#!@cas*CBCL32")
    assert.ok(result.strong)
    assert.equal(result.errors.length, 0)
  })
})
