import { test } from "node:test"
import assert from "node:assert/strict"
import { Server } from "#src/core/server/index.mjs"
import { db } from "#src/core/database/index.mjs"
import { UserRole } from "@prisma/client"
import { AuthService } from "#src/core/services/authService/index.mjs"
import { Password } from "#src/core/helpers/password.mjs"
import { faker } from "@faker-js/faker"

test("resetForgottenPassword", async (t) => {
  /** @typedef {import("./resetForgottenPassword.schema.mjs").Body} Body */

  const server = Server.new()
  const url = "/api/forgot-password/reset-password"
  const method = "POST"

  await t.test("valid request", async () => {
    /** setup */
    const user = await db.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.internet.userName(),
        role: UserRole.USER,
        password: {
          create: {
            hash: await Password.hash(faker.internet.password()),
          },
        },
      },
    })
    const resetToken = await AuthService.generatePasswordResetToken(user.id)

    /** test */
    const newPassword = "$@#VEq%^&245"
    const res = await server.inject({
      url,
      method,
      payload: /** @type {Body} */ ({
        token: resetToken,
        password: newPassword,
        confirmPassword: newPassword,
      }),
    })
    assert.equal(res.statusCode, 200)

    const updatedUser = await db.user.findUnique({
      where: { id: user.id },
      include: { password: true },
    })

    const isHashValid = await Password.verify(
      updatedUser?.password?.hash ?? "",
      newPassword,
    )
    assert.ok(isHashValid)

    /** cleanup */
    await db.user.delete({ where: { id: user.id } })
  })
})
