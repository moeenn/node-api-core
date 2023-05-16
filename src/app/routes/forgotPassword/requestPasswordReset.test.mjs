/** @typedef {import("#src/app/emails/forgotPasswordEmail.mjs").ForgotPasswordEmailArgs} ForgotPasswordEmailArgs */
import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { Server } from "#src/core/server/index.mjs"
import { db } from "#src/core/database/index.mjs"
import { UserRole } from "@prisma/client"
import { EmailService } from "#src/core/email/index.mjs"
import { AuthService } from "#src/core/services/authService/index.mjs"

describe("requestPasswordReset", () => {
  const server = Server.new()
  const url = "/api/forgot-password/request-reset"
  const method = "POST"

  it("valid request", async () => {
    /** setup */
    const user = await db.user.create({
      data: {
        email: "user@site.com",
        name: "User",
        staffId: "AB100",
        role: UserRole.USER,
      },
    })

    /** test */
    const res = await server.inject({
      url,
      method,
      payload: {
        email: user.email,
      },
    })
    assert.equal(res.statusCode, 200)

    const isEmailSent = EmailService.instance().sentEmails.find(
      (e) => e.to == user.email,
    )

    const emailArgs = /** @type {ForgotPasswordEmailArgs} */ (
      isEmailSent?.email.args
    )
    assert.ok(emailArgs.resetToken)

    const isTokenValid = await AuthService.validatePasswordResetToken(
      emailArgs.resetToken,
    )

    assert.ok(isTokenValid !== "")

    /** cleanup */
    await db.user.delete({ where: { id: user.id } })
    EmailService.instance().clearSentEmails()
  })

  it("invalid email address", async () => {
    const email = "some_random_nonexistent_email@site.com"

    const res = await server.inject({
      url,
      method,
      payload: {
        email,
      },
    })
    assert.equal(res.statusCode, 200)

    const isEmailSent = EmailService.instance().sentEmails.find(
      (e) => e.to == email,
    )

    assert.equal(isEmailSent, undefined)
  })
})
