import { describe, it, expect, afterAll } from "vitest"
import { Server } from "#src/core/server"
import { db } from "#src/core/database/index.mjs"
import { UserRole } from "@prisma/client"
import { AuthService } from "#src/core/services/authService/index.mjs"
import { Password } from "#src/core/helpers"

describe("setFirstPassword", () => {
  const server = Server.new()
  const url = "/api/user/configure"
  const method = "POST"

  afterAll(() => server.close())

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
    expect(res.statusCode).toBe(200)

    const updatedUser = await db.user.findUnique({
      where: { id: user.id },
      include: { password: true },
    })
    expect(updatedUser?.password).toBeTruthy()

    const isHashCorrect = await Password.verify(
      updatedUser?.password?.hash ?? "",
      password,
    )

    expect(isHashCorrect).toBe(true)

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
    expect(res.statusCode).toBe(400)

    const body = JSON.parse(res.body)
    expect(body.message.includes("already configured")).toBe(true)

    /** cleanup */
    await db.user.delete({ where: { id: user.id } })
  })
})
