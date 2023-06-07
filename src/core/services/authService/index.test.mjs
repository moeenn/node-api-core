import { UserRole } from "@prisma/client"
import { test } from "node:test"
import assert from "node:assert/strict"
import { AuthService } from "./index.mjs"

test("AuthService", async t => {
  await t.test("generate and validate login auth token", async () => {
    const loginToken = await AuthService.generateLoginAuthToken(
      "abc123",
      UserRole.USER,
    )

    const { userId, userRole } = await AuthService.validateLoginAuthToken(
      loginToken.token,
    )
    assert.equal(userId, "abc123")
    assert.equal(userRole, UserRole.USER)
  })

  await t.test("invalid login auth token", async () => {
    assert.rejects(() => AuthService.validateLoginAuthToken("random-token"), {
      message: /Invalid/,
    })
  })

  await t.test("generate and validate first password token", async () => {
    const loginToken = await AuthService.generateFirstPasswordToken("abc123")
    const userId = await AuthService.validateFirstPasswordToken(loginToken)
    assert.equal(userId, "abc123")
  })

  await t.test("invalid first password token", async () => {
    assert.rejects(
      () => AuthService.validateFirstPasswordToken("random-token"),
      { message: /Invalid/ },
    )
  })

  await t.test("generate and validate password reset token", async () => {
    const loginToken = await AuthService.generatePasswordResetToken("abc123")
    const userId = await AuthService.validatePasswordResetToken(loginToken)
    assert.equal(userId, "abc123")
  })

  await t.test("invalid reset password token", async () => {
    assert.rejects(
      () => AuthService.validatePasswordResetToken("random-token"),
      { message: /Invalid/ },
    )
  })
})
