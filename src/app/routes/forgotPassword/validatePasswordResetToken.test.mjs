import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { Server } from "#src/core/server/index.mjs"
import { db } from "#src/core/database/index.mjs"
import { UserRole } from "@prisma/client"
import { AuthService } from "#src/core/services/authService/index.mjs"
import { faker } from "@faker-js/faker"

describe("validatePasswordResetToken", () => {
  const server = Server.new()
  const url = "/api/forgot-password/validate-reset-token"
  const method = "POST"

  it("valid request", async () => {
    /** setup */
    const user = await db.user.create({
      data: {
        email: faker.internet.email(),
        name: "User",
        staffId: faker.string.alphanumeric(),
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

    assert.equal(res.statusCode, 200)
    const body = /** @type {{ isValid: boolean }} */ (JSON.parse(res.body))
    assert.ok(body.isValid)

    /** cleanup */
    await db.user.delete({ where: { id: user.id } })
  })
})
