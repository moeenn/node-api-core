import { UserRole } from "@prisma/client"
import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { AuthService } from "./index.mjs"

describe("AuthService", () => {
  it("generate and validate login auth token", async () => {
    const loginToken = await AuthService.generateLoginAuthToken(
      "abc123",
      UserRole.USER,
    )

    const { userId, userRole } = await AuthService.validateLoginAuthToken(
      loginToken,
    )
    assert.equal(userId, "abc123")
    assert.equal(userRole, UserRole.USER)
  })

  it("invalid login auth token", async () => {
    assert.throws(() =>
      AuthService.validateLoginAuthToken("random-token"),
    ) /* .rejects.toThrowError("Invalid") */
  })

  it("generate and validate first password token", async () => {
    const loginToken = await AuthService.generateFirstPasswordToken("abc123")
    const userId = await AuthService.validateFirstPasswordToken(loginToken)
    assert.equal(userId, "abc123")
  })

  it("invalid first password token", async () => {
    assert.throws(() =>
      AuthService.validateFirstPasswordToken("random-token"),
    ) /* .rejects.toThrowError("Invalid") */
  })

  it("generate and validate password reset token", async () => {
    const loginToken = await AuthService.generatePasswordResetToken("abc123")
    const userId = await AuthService.validatePasswordResetToken(loginToken)
    assert.equal(userId, "abc123")
  })

  it("invalid reset password token", async () => {
    assert.throws(() =>
      AuthService.validatePasswordResetToken("random-token"),
    ) /* .rejects.toThrowError("Invalid") */
  })
})
