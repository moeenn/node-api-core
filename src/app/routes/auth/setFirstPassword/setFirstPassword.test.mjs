import { test } from "node:test"
import assert from "node:assert/strict"
import { Server } from "#src/core/server/index.mjs"
import { db } from "#src/core/database/index.mjs"
import { UserRole } from "@prisma/client"
import { AuthService } from "#src/core/services/authService/index.mjs"
import { Password } from "#src/core/helpers/password.mjs"
import { faker } from "@faker-js/faker"

test("setFirstPassword", async (t) => {
  /** @typedef {import("./setFirstPassword.schema.mjs").Body} Body */

  const server = Server.new()
  const url = "/api/user/configure"
  const method = "POST"

  await t.test("valid configure request", async () => {
    /** setup */
    const user = await db.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.internet.userName(),
        role: UserRole.USER,
      },
    })

    const firstPasswordToken = await AuthService.generateFirstPasswordToken(
      user.id,
    )

    /** test */
    const password = "!@#ABC$%^678s"
    const res = await server.inject({
      url,
      method,
      payload: /** @type {Body} */ ({
        passwordToken: firstPasswordToken,
        password,
        confirmPassword: password,
      }),
    })
    assert.equal(res.statusCode, 200)

    const updatedUser = await db.user.findUnique({
      where: { id: user.id },
      include: { password: true },
    })
    assert.ok(updatedUser?.password)

    const isHashCorrect = await Password.verify(
      updatedUser?.password?.hash ?? "",
      password,
    )

    assert.ok(isHashCorrect)

    /** cleanup */
    await db.user.delete({ where: { id: user.id } })
  })

  await t.test("account already configured", async () => {
    /** setup */
    const password = faker.internet.password({ length: 10 })
    const user = await db.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.internet.userName(),
        role: UserRole.USER,
        password: {
          create: {
            hash: await Password.hash(password),
          },
        },
      },
    })

    const firstPasswordToken = await AuthService.generateFirstPasswordToken(
      user.id,
    )

    /** test */
    const updatedPassword = "!@#ABC$%^678s"
    const res = await server.inject({
      url,
      method,
      payload: /** @type {Body} */ ({
        passwordToken: firstPasswordToken,
        password: updatedPassword,
        confirmPassword: updatedPassword,
      }),
    })
    assert.equal(res.statusCode, 400)

    const body = JSON.parse(res.body)
    assert.ok(body.message.includes("already configured"))

    /** cleanup */
    await db.user.delete({ where: { id: user.id } })
  })
})
