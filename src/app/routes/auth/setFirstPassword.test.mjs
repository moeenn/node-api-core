import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { Server } from "#src/core/server/index.mjs"
import { db } from "#src/core/database/index.mjs"
import { UserRole } from "@prisma/client"
import { AuthService } from "#src/core/services/authService/index.mjs"
import { Password } from "#src/core/helpers/password.mjs"

describe("setFirstPassword", () => {
  const server = Server.new()
  const url = "/api/user/configure"
  const method = "POST"

  it("valid configure request", async () => {
    /** setup */
    const user = await db.user.create({
      data: {
        email: "user@site.com",
        name: "User",
        staffId: "AB100",
        role: UserRole.USER,
      },
    })

    const firstPasswordToken = await AuthService.generateFirstPasswordToken(
      user.id,
    )

    /** test */
    const password = "some_random_13123_password"
    const res = await server.inject({
      url,
      method,
      payload: {
        passwordToken: firstPasswordToken,
        password,
        confirmPassword: password,
      },
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

  it("account already configured", async () => {
    /** setup */
    const password = "some_random_password-231313"
    const user = await db.user.create({
      data: {
        email: "user@site.com",
        name: "User",
        staffId: "AB100",
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
    const updatedPassword = "another_weak_password111"
    const res = await server.inject({
      url,
      method,
      payload: {
        passwordToken: firstPasswordToken,
        password: updatedPassword,
        confirmPassword: updatedPassword,
      },
    })
    assert.equal(res.statusCode, 400)

    const body = JSON.parse(res.body)
    assert.ok(body.message.includes("already configured"))

    /** cleanup */
    await db.user.delete({ where: { id: user.id } })
  })
})
