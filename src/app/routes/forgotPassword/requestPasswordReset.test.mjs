import { describe, it, expect, afterAll } from "vitest"
import { Server } from "#src/core/server"
import { db } from "#src/core/database/index.mjs"
import { UserRole } from "@prisma/client"
import { EmailService } from "#src/core/email"
import { ForgotPasswordEmailArgs } from "#src/app/emails"
import { AuthService } from "#src/core/services/authService/index.mjs"

describe("requestPasswordReset", () => {
  const server = Server.new()
  const url = "/api/forgot-password/request-reset"
  const method = "POST"

  afterAll(() => server.close())

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
    expect(res.statusCode).toBe(200)

    const isEmailSent = EmailService.instance().sentEmails.find(
      (e) => e.to == user.email,
    )

    const emailArgs = isEmailSent?.email.args as ForgotPasswordEmailArgs
    expect(emailArgs.resetToken).toBeTruthy()

    const isTokenValid = await AuthService.validatePasswordResetToken(
      emailArgs.resetToken,
    )
    expect(isTokenValid !== "").toBe(true)

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
    expect(res.statusCode).toBe(200)

    const isEmailSent = EmailService.instance().sentEmails.find(
      (e) => e.to == email,
    )
    expect(isEmailSent).toBeFalsy()
  })
})
