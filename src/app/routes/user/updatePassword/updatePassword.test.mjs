import { test } from "node:test"
import assert from "node:assert/strict"
import { Server } from "#src/core/server/index.mjs"
import { db } from "#src/core/database/index.mjs"
import { UserRole } from "@prisma/client"
import { Password } from "#src/core/helpers/password.mjs"
import { AuthService } from "#src/core/services/authService/index.mjs"
import { faker } from "@faker-js/faker"

test("updatePassword", async (t) => {
  const server = Server.new()
  const url = "/api/user/update-password"
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
    const authToken = await AuthService.generateLoginToken(user.id, user.role)

    /** test */
    const updatedPassword = "!@#Abc#$%_234"
    const res = await server.inject({
      url,
      method,
      headers: {
        authorization: "Bearer " + authToken.token,
      },
      payload: {
        password: updatedPassword,
        confirmPassword: updatedPassword,
      },
    })
    assert.equal(res.statusCode, 200)

    const updatedUser = await db.user.findUnique({
      where: { id: user.id },
      include: { password: true },
    })

    const isHashValid = await Password.verify(
      updatedUser?.password?.hash ?? "",
      updatedPassword,
    )
    assert.ok(isHashValid)

    /** cleanup */
    await db.user.delete({ where: { id: user.id } })
  })

  server.close()
})
