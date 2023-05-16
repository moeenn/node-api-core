import { describe, it, expect, afterAll } from "vitest"
import { Server } from "#src/core/server"
import { db } from "#src/core/database/index.mjs"
import { UserRole } from "@prisma/client"
import { AuthService } from "#src/core/services/authService/index.mjs"

describe("validatePasswordResetToken", () => {
  const server = Server.new()
  const url = "/api/forgot-password/validate-reset-token"
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
    const resetToken = await AuthService.generatePasswordResetToken(user.id)

    /** test */
    const res = await server.inject({
      url,
      method,
      payload: {
        token: resetToken,
      },
    })
    expect(res.statusCode).toBe(200)

    const body = JSON.parse(res.body) as { isValid: boolean }
    expect(body.isValid).toBe(true)

    /** cleanup */
    await db.user.delete({ where: { id: user.id } })
  })
})
