import { describe, it, after } from "node:test"
import assert from "node:assert/strict"
import { Server } from "#src/core/server/index.mjs"
import { db } from "#src/core/database/index.mjs"
import { UserRole } from "@prisma/client"
import { Password } from "#src/core/helpers/password.mjs"
import { AuthService } from "#src/core/services/authService/index.mjs"

describe("updatePassword", () => {
  const server = Server.new()
  const url = "/api/user/update-password"
  const method = "POST"

  after(() => server.close())

  it("valid request", async () => {
    /** setup */
    const user = await db.user.create({
      data: {
        email: "user@site.com",
        name: "User",
        staffId: "AB100",
        role: UserRole.USER,
        password: {
          create: {
            hash: await Password.hash("some_random-password"),
          },
        },
      },
    })
    const authToken = await AuthService.generateLoginAuthToken(
      user.id,
      user.role,
    )

    /** test */
    const updatedPassword = "another-new-password-123123"
    const res = await server.inject({
      url,
      method,
      headers: {
        authorization: "Bearer " + authToken,
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
})
