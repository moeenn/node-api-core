/** @typedef {import("./validatePasswordResetToken.schema.mjs").Body} Body */

import { test } from "node:test"
import assert from "node:assert/strict"
import { Server } from "#src/core/server/index.mjs"
import { db } from "#src/core/database/index.mjs"
import { UserRole } from "@prisma/client"
import { AuthService } from "#src/core/services/authService/index.mjs"
import { faker } from "@faker-js/faker"

test("validatePasswordResetToken", async (t) => {
  const server = Server.new()
  const url = "/api/forgot-password/validate-reset-token"
  const method = "POST"

  await t.test("valid request", async () => {
    /** setup */
    const user = await db.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.internet.userName(),
        role: UserRole.USER,
      },
    })
    const resetToken = await AuthService.generatePasswordResetToken(user.id)

    /** test */
    const res = await server.inject({
      url,
      method,
      payload: /** @type {Body} */ ({
        token: resetToken,
      }),
    })

    assert.equal(res.statusCode, 200)
    const body = /** @type {{ isValid: boolean }} */ (JSON.parse(res.body))
    assert.ok(body.isValid)

    /** cleanup */
    await db.user.delete({ where: { id: user.id } })
  })
})
